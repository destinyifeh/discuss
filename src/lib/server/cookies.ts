'use server';

import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/constants/api-resources';
import {cookies} from 'next/headers';

/** HTTP‑only cookie helpers for SSR, server actions, route handlers */

/* ------------ access‑token cookie ------------ */

export const removeCookieAccessToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN);
};

/* ------------ refresh‑token cookie ------------ */

export const removeCookieRefreshToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_TOKEN);
};
