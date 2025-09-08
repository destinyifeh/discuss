'use server';

import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REFRESH_TOKEN,
} from '@/constants/api-resources';
import {LoginRequestProps} from '@/modules/auth/types';
import axios from 'axios';
import {cookies} from 'next/headers';

/** HTTP‑only cookie helpers for SSR, server actions, route handlers */

/* ------------ access‑token cookie ------------ */

export const removeCookieAccessToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN as string);
};

/* ------------ refresh‑token cookie ------------ */

export const removeCookieRefreshToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_TOKEN as string);
};

export const setSecureToken = async (
  accessToken: string,
  refrshToken: string,
) => {
  const cookieStore = await cookies(); // No await needed

  cookieStore.set({
    name: ACCESS_TOKEN as string,
    value: accessToken,
    httpOnly: true,
    path: '/',
    maxAge: 2 * 60, // 2 minutes
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  cookieStore.set({
    name: REFRESH_TOKEN as string,
    value: refrshToken,
    httpOnly: true,
    path: '/',
    maxAge: 3 * 60, // 2 minutes
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

export async function loginRequestAction3(data: LoginRequestProps) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data, {
    withCredentials: true,
  });
  console.log(res, 'restooman');

  const {user, accessToken, refreshToken} = res?.data ?? {};

  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_TOKEN as string,
    value: accessToken,
    httpOnly: true,
    path: '/',
    maxAge: 2 * 60,
    sameSite: 'none',
    domain: 'discuss-server-bh9l.onrender.com',
    secure: true,
  });
  cookieStore.set({
    name: REFRESH_TOKEN as string,
    value: refreshToken,
    httpOnly: true,
    path: '/',
    maxAge: 3 * 60,
    sameSite: 'none',
    domain: 'discuss-server-bh9l.onrender.com',
    secure: true,
  });

  return {user};
}
