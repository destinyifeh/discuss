// lib/api.ts

//import {saveAccessToken, saveRefreshToken} from '@/services/local-store';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {getCookieAccessToken} from '../server/cookies';
import {
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
} from './local-storage';

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
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api`, // e.g. https://api.example.com
  withCredentials: true, // send cookies
});

/* ------------------------------------------------------------------ */
/* 2 . REQUEST – attach access token                                   */
/* ------------------------------------------------------------------ */
api.interceptors.request.use(
  async config => {
    console.log(config, 'config');
    if (typeof window !== 'undefined') {
      // —— client ——
      // const token = localStorage.getItem('accessToken');
      const token = getAccessToken();
      if (token) config.headers!['Authorization'] = `Bearer ${token}`;
    } else {
      // —— server ——
      const token = await getCookieAccessToken(); // no await in Next 14
      if (token) config.headers!['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

/* ------------------------------------------------------------------ */
/* 3 . Simple single‑flight refresh queue                              */
/* ------------------------------------------------------------------ */
let isRefreshing = false;
let failedQueue: Array<[(token?: string) => void, (err: unknown) => void]> = [];

const processQueue = (err: unknown, token: string | null = null) => {
  failedQueue.forEach(([res, rej]) => (err ? rej(err) : res(token!)));
  failedQueue = [];
};

/* ------------------------------------------------------------------ */
/* 4 . RESPONSE – handle 401 once, queue the rest                      */
/* ------------------------------------------------------------------ */
api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    console.log(error, 'destoo');
    const orig = error.config as AxiosRequestConfig;

    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push([
            token => {
              if (token) orig.headers!['Authorization'] = `Bearer ${token}`;
              resolve(api(orig));
            },
            reject,
          ]);
        });
      }

      isRefreshing = true;
      try {
        // ----  refresh call  ----
        const {data} = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/auth/refresh-token`,
          {},
          {withCredentials: true},
        );

        const newToken = data.accessToken as string;
        const refreshToken = data.refreshToken as string;
        /* -------- persist the *access* token -------- */
        if (typeof window !== 'undefined') {
          saveAccessToken(newToken);
          saveRefreshToken(refreshToken);
        } else {
          // keep it server‑side in an HTTP‑only cookie
          //   const cookieStore = await cookies();
          //   cookieStore.set('accessToken', newToken, {
          //     httpOnly: true,
          //     secure: process.env.NODE_ENV === 'production',
          //     sameSite: 'lax',
          //     path: '/', // or '/api/private' if you want to scope it
          //     maxAge: 60 * 60, // 1 h – match your JWT exp
          //   });
          // await saveCookieAccessToken(newToken);
          // await saveCookieRefreshToken(refreshToken);
        }

        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(orig); // retry original
      } catch (err) {
        processQueue(err, null);
        //logout
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
