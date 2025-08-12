'use client';

import {usePathname, useRouter} from 'next/navigation';
import {useEffect} from 'react';

import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {isPublicPath} from './is-public-path';

export const useAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const {isAuthenticated, currentUser, hasHydrated} = useAuthStore(
    state => state,
  );
  console.log(currentUser, isAuthenticated, 'dddeer');
  console.log(pathname, 'deerrree');

  useEffect(() => {
    if (!hasHydrated || !pathname) return;

    // 1. Guest on private page → /login
    if (!isAuthenticated && !isPublicPath(pathname)) {
      toast.info('Oops! You need to be logged in to access this page.');
      router.replace('/login');
      return;
    }

    // 2. Logged‑in user on public page → /home
    if (isAuthenticated && isPublicPath(pathname)) {
      toast.info("You're signed in. Taking you home.");
      router.replace('/home');
    }
  }, [isAuthenticated, hasHydrated, pathname, router]);
};
