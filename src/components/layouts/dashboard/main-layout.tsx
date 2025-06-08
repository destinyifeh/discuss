'use client';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {usePathname} from 'next/navigation';
import React, {useState} from 'react';
import {MobileBottomTab} from './mobile-bottom-tab';
import MobileNavigation from './mobile-navigation';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({children}: MainLayoutProps) => {
  const location = usePathname();
  const {theme} = useGlobalStore(state => state);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {showBottomTab} = useGlobalStore(state => state);

  const isSection =
    location.includes('/discuss/') ||
    (location.includes('/post/') && !location.includes('/reply')) ||
    location.includes('/user/') ||
    location.includes('/create-post') ||
    location.includes('/bookmarks') ||
    location.includes('/profile/');

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;

  //     // If scrolling down, hide the bottom tab
  //     if (currentScrollY > lastScrollY) {
  //       setShowBottomTab(false);
  //     } else {
  //       // Scrolling up
  //       setShowBottomTab(true);
  //     }

  //     setLastScrollY(currentScrollY);
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [lastScrollY]);

  return (
    <React.Fragment>
      {!isSection && <MobileNavigation />}
      <main
        className={clsx('flex-1 flex flex-col max-w-3xl mx-auto border-x', {
          'border-app-border ': theme.type === 'default',
          'border-app-dark-border': theme.type === 'dark',
        })}>
        <div className={`${isSection ? 'pt-0' : 'pt-14'} md:pt-0`}>
          {children}
        </div>
        {showBottomTab && <MobileBottomTab />}
      </main>
    </React.Fragment>
  );
};
