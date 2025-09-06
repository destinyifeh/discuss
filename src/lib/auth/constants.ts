import {ACCESS_TOKEN} from '@/constants/api-resources';

export const PUBLIC_PATHS: string[] = [
  '/about',
  '/help-center',
  '/terms-of-service',
  '/privacy-policy',
  '/ads-info',
];

export const ACCESS_TOKEN_EXPIRATION_MS = 2 * 60 * 1000;

export const setAccessToken = (accessToken: string) => {
  document.cookie = `${ACCESS_TOKEN}=${accessToken}; Path=/; SameSite=None; Secure; Max-Age=${
    ACCESS_TOKEN_EXPIRATION_MS / 1000
  }`;
};
