import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/constants/api-resources';

export const saveAccessToken = (token: string) =>
  localStorage.setItem(ACCESS_TOKEN, token);

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN);

export const removeAccessToken = () => localStorage.removeItem(ACCESS_TOKEN);

export const saveRefreshToken = (token: string) =>
  localStorage.setItem(REFRESH_TOKEN, token);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN);

export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN);
