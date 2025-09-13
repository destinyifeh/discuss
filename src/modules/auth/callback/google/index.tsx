'use client';

import ScreenLoader from '@/components/feedbacks/screen-loader';
import {toast} from '@/components/ui/toast';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/constants/api-resources';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {getGoogleUser} from '../../actions';

export const GoogleCallbackPage = () => {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);
  const {item} = useGlobalStore(state => state);

  const {
    isLoading,
    error,
    data: googleUser,
  } = useQuery({
    queryKey: ['google-user'],
    queryFn: () => getGoogleUser(),
    retry: false,
  });
  console.log({error, googleUser});
  console.log(googleUser, 'googleuserr');
  /* -------- handle side‑effects AFTER render ------------------ */
  useEffect(() => {
    if (error) {
      toast.error('Oops! Something went wrong. Please log in again.');
      router.replace('/login');
      return;
    }

    if (googleUser) {
      setUser(googleUser.user);
      //will be remove later
      //setSecureToken(googleUser.accessToken, googleUser.refreshToken);
      // 15 minutes = 15 * 60 seconds
      document.cookie = `${ACCESS_TOKEN}=${
        googleUser.accessToken
      }; Path=/; Max-Age=${15 * 60}; SameSite=None; Secure`;

      // 7 days = 7 * 24 * 60 * 60 seconds
      document.cookie = `${REFRESH_TOKEN}=${
        googleUser.refreshToken
      }; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=None; Secure`;

      const storedNext = localStorage.getItem('nextRoute') as string;
      localStorage.removeItem('nextRoute');
      router.replace(storedNext);
    }
  }, [error, googleUser, router, setUser]);

  /* -------- render phase -------------------------------------- */

  if (isLoading) {
    return <ScreenLoader />;
  }

  return <ScreenLoader />;
};
