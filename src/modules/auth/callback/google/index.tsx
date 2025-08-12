'use client';

import {HomeDashboardSkeleton} from '@/components/skeleton/home-dashboard-skeleton';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useQuery} from '@tanstack/react-query';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';
import {getGoogleUserRequestAction} from '../../actions';

export const GoogleCallbackPage = () => {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);

  const searchParams = useSearchParams();
  const token = searchParams.get('token') as string;

  console.log(token, 'token');

  const {
    isLoading,
    error,
    data: googleUser,
  } = useQuery({
    queryKey: ['google-user', token],
    queryFn: () => getGoogleUserRequestAction(token),

    enabled: !!token, // runs only when token is defined
    retry: false,
  });
  console.log({error, googleUser});

  /* -------- handle side‑effects AFTER render ------------------ */
  useEffect(() => {
    if (error) {
      toast.error('Oops! Something went wrong. Please log in again.');
      router.replace('/login');
      return;
    }

    if (googleUser) {
      setUser(googleUser.user);
      router.replace('/home');
    }
  }, [error, googleUser, router, setUser]);

  /* -------- render phase -------------------------------------- */

  if (isLoading) {
    return <HomeDashboardSkeleton />;
  }

  return null;
};
