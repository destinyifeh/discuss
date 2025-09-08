'use server';

import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/constants/api-resources';
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
