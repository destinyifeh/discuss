export const PUBLIC_PATHS = [
  '/',
  '/about',
  '/help-center',
  '/terms-of-service',
  '/privacy-policy',
  '/ads-info',
  '/register',
  '/forgot-password',
  '/login',
  '/reset-password',
];

export const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.some(p => {
    if (p === '/') return pathname === '/'; // exact root
    return pathname === p || pathname.startsWith(`${p}/`);
  });
