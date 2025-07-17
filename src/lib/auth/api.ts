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
    console.log(error, 'destoo');
    const orig = error.config as AxiosRequestConfig;

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
        const {data} = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {withCredentials: true},
        );

        console.log(data, 'dataa refr');

        console.log(orig, 'dataanewwwhereee');

        processQueue(null);
        return api(orig); // retry original
      } catch (err) {
        processQueue(err);
        //logout
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
