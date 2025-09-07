// lib/serverApi.ts
import {API_BASE_URL} from '@/constants/api-resources';
import axios from 'axios';

const serverApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies cross-origin
});

//Request

serverApi.interceptors.request.use(
  async config => {
    console.log(config, 'config');
    return config;
  },
  error => Promise.reject(error),
);

// 🔹 Response interceptor for refresh logic
serverApi.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Attempt refresh
        const refreshRes = await serverApi.post('/auth/refresh-token');
        console.log(refreshRes, 'refresh');
        // Retry original request
        return serverApi(original);
      } catch (refreshErr) {
        console.error('Refresh failed:', refreshErr);

        // 🔹 logout + redirect
        if (typeof window !== 'undefined') {
          window.location.href = '/login?reason=sessionExpired';
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default serverApi;
