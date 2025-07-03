// src/lib/api-server.ts
// This file is for server-side code only (Next.js API Routes, Server Components)
// It makes requests directly to your NestJS backend.

import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {cookies} from 'next/headers'; // This is allowed here!

import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants/api';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const NESTJS_BASE_URL = process.env.NESTJS_BACKEND_URL; // Your actual NestJS backend URL

const apiServer: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api`, // e.g. https://api.example.com
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Attach HttpOnly access token from cookies
apiServer.interceptors.request.use(
  async config => {
    // This code runs ONLY on the server
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response Interceptor: (Optional) Handle 401 for server-side refresh flow
// This would involve calling your NestJS refresh endpoint and then
// setting new HttpOnly cookies via `cookies().set()`
let isRefreshingServer = false;
let failedQueueServer: Array<
  [(token?: string) => void, (err: unknown) => void]
> = [];

const processQueueServer = (err: unknown, token: string | null = null) => {
  failedQueueServer.forEach(([res, rej]) => (err ? rej(err) : res(token!)));
  failedQueueServer = [];
};

apiServer.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const orig = error.config as AxiosRequestConfig;

    // This 401 handling is for when your *NestJS backend* returns a 401.
    // You'd attempt to refresh the token directly with NestJS.
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;

      if (isRefreshingServer) {
        return new Promise((resolve, reject) => {
          failedQueueServer.push([
            token => {
              if (token) orig.headers!['Authorization'] = `Bearer ${token}`;
              resolve(apiServer(orig));
            },
            reject,
          ]);
        });
      }

      isRefreshingServer = true;
      try {
        // ----  refresh call to NestJS backend ----
        const {data} = await axios.post(
          `${NESTJS_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true, // Send refresh token cookie to NestJS
            headers: {
              // You might need to manually get the refresh token from cookies here
              // if your NestJS refresh endpoint expects it in a header,
              // otherwise `withCredentials: true` will send the HttpOnly refresh token cookie.
            },
          },
        );

        const newToken = data.accessToken as string;
        const newRefreshToken = data.refreshToken as string; // Assuming NestJS returns new refresh token

        // Set new HttpOnly cookies on the Next.js server response
        const cookieStore = await cookies();
        cookieStore.set(ACCESS_TOKEN, newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // Match your JWT exp
        });
        cookieStore.set(REFRESH_TOKEN, newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // Match your refresh token exp
        });

        apiServer.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        processQueueServer(null, newToken);
        return apiServer(orig); // retry original
      } catch (err) {
        processQueueServer(err, null);
        // On refresh failure, clear cookies and potentially redirect
        const cookieStore = await cookies();
        cookieStore.delete(ACCESS_TOKEN);
        cookieStore.delete(REFRESH_TOKEN);
        // In a Server Component, you'd use `redirect('/login')`
        // In an API Route, you might return a 401 and let the client handle redirection.
        return Promise.reject(err);
      } finally {
        isRefreshingServer = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiServer;
