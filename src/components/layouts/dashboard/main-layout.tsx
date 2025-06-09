'use client';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {usePathname} from 'next/navigation';
import React from 'react';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({children}: MainLayoutProps) => {
  const location = usePathname();
  const {theme} = useGlobalStore(state => state);

  const isSection2 =
    location.includes('/discuss/') ||
    (location.includes('/post/') && !location.includes('/reply')) ||
    location.includes('/user/') ||
    location.includes('/create-post') ||
    location.includes('/bookmarks') ||
    location.includes('/profile/');

  const isSection = location.includes('/home');

  return (
    <main
      className={clsx('flex-1 flex flex-col max-w-3xl mx-auto border-x', {
        'border-app-border ': theme.type === 'default',
        'border-app-dark-border': theme.type === 'dark',
      })}>
      <div className="pt-0 md:pt-0">{children}</div>
    </main>
  );
};
