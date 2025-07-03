'use server';

import {ACCESS_COOKIE, REFRESH_COOKIE} from '@/constants/api-resources';
import {cookies} from 'next/headers';

/** HTTP‑only cookie helpers for SSR, server actions, route handlers */

/* ------------ access‑token cookie ------------ */

export const saveCookieAccessToken = async (token: string) => {
  console.log(token, 'token dee');
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });
  console.log(token, 'token dee finall');
};

export async function getCookieAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  return token;
}

export const removeCookieAccessToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
};

/* ------------ refresh‑token cookie ------------ */

export const saveCookieRefreshToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/', // or '/api/auth' to narrow scope
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

export async function getCookieRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFRESH_COOKIE)?.value;
  return token;
}

export const removeCookieRefreshToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_COOKIE);
};
