export const GUEST_ONLY = [
  '/', // landing
  '/about',
  '/help-center',
  '/terms-of-service',
  '/privacy-policy',
  '/ads-info',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/login/google/callback',
  '/api/routes/auth/login',
];

/** Returns true if the current pathname matches any guest‑only route */
export const isGuestOnly = (pathname: string) =>
  GUEST_ONLY.some(p =>
    p === '/'
      ? pathname === '/' // exact root
      : pathname === p || pathname.startsWith(`${p}/`),
  );
