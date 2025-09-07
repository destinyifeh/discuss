// lib/api.ts

import {API_BASE_URL} from '@/constants/api-resources';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {redirect} from 'next/navigation';

/* ------------------------------------------------------------------ */
/* 0 . Tell TypeScript about our private _retry flag                   */
/* ------------------------------------------------------------------ */
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

/* ------------------------------------------------------------------ */
/* 1 . Create base instance                                            */
/* ------------------------------------------------------------------ */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // e.g. https://api.example.com
  withCredentials: true, // send cookies
});

/* ------------------------------------------------------------------ */
/* Refresh + logout helpers that bypass baseURL                       */
/* ------------------------------------------------------------------ */
async function callRefresh() {
  return axios.post(
    '/api/auth/refresh', // 👈 Next.js route, not backend
    {},
    {withCredentials: true},
  );
}

async function callLogout() {
  return axios.post('/api/auth/logout', {}, {withCredentials: true});
}

/* ------------------------------------------------------------------ */
/* 2 . REQUEST – attach access token                                   */
/* ------------------------------------------------------------------ */
api.interceptors.request.use(
  async config => {
    console.log(config, 'config');
    return config;
  },
  error => Promise.reject(error),
);

/* ------------------------------------------------------------------ */
/* 3 . Simple single‑flight refresh queue                              */
/* ------------------------------------------------------------------ */
let isRefreshing = false;
let failedQueue: Array<[() => void, (err: unknown) => void]> = [];

const processQueue = (err: unknown) => {
  failedQueue.forEach(([res, rej]) => (err ? rej(err) : res()));
  failedQueue = [];
};

/* ------------------------------------------------------------------ */
/* 4 . RESPONSE – handle 401 once, queue the rest                      */
/* ------------------------------------------------------------------ */
api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    console.log('Interceptor caught error:', error);
    const orig = error.config as AxiosRequestConfig;

    if (axios.isAxiosError(error)) {
      console.log('Status:', error.response?.status);
      console.log('Response datas:', error.response?.data);
    } else {
      console.log('Unexpected error object:', error);
    }

    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push([
            () => {
              resolve(api(orig));
            },
            reject,
          ]);
        });
      }

      isRefreshing = true;
      try {
        // const {data} = await axios.post(
        //   `${API_BASE_URL}/auth/refresh-token`,
        //   {},
        //   {withCredentials: true},
        // );

        // 🔹 Call Next.js refresh route (not backend directly)
        const refresh = await axios.post(
          `${
            typeof window !== 'undefined' ? window.location.origin : ''
          }/api/routes/auth/refresh`,
          {},
          {withCredentials: true},
        );
        // await callRefresh();

        console.log('Refreshed:', refresh.data);

        console.log(orig, 'dataanewwwhereee');

        processQueue(null);
        return api(orig); // retry original
      } catch (refreshErr: any) {
        if (axios.isAxiosError(refreshErr)) {
          console.error(
            'Refresh token failed with status:',
            refreshErr.response?.status,
          );
          console.error('Refresh token response:', refreshErr.response?.data);
        } else {
          console.error('Unexpected refresh token error:', refreshErr);
        }
        processQueue(refreshErr);
        //logout
        // await callLogout();
        if (typeof window !== 'undefined') {
          return (window.location.href = '/login?reason=sessionExpired');
        }
        redirect('/login?reason=sessionExpired');

        //return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
