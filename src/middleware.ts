// middleware.ts
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {isGuestOnly} from './lib/auth/paths';
import {ACCESS_TOKEN} from './lib/constants/api';

export function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;
  const token = req.cookies.get(ACCESS_TOKEN)?.value;
  const guestRoute = isGuestOnly(pathname);

  // ──────────────── LOGGED‑IN user ────────────────
  if (token && guestRoute) {
    // Already authenticated ➜ redirect away from guest pages
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // ──────────────── LOGGED‑OUT user ───────────────
  if (!token && !guestRoute) {
    // Trying to visit a private page ➜ send to login
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // all good
}

export const config = {
  matcher: '/((?!_next|.*\\..*).*)', // run on every route except static files
};
