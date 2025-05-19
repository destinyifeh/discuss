'use client';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {usePathname} from 'next/navigation';
import React, {useState} from 'react';
import {MobileBottomTab} from './mobile-bottom-tab';
import MobileNavigation from './mobile-navigation';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({children}: MainLayoutProps) => {
  const location = usePathname();
  const [lastScrollY, setLastScrollY] = useState(0);
  const {showBottomTab} = useGlobalStore(state => state);

  const isCategorySection =
    location.includes('/discuss/') ||
    (location.includes('/post/') && !location.includes('/reply'));

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
      {!isCategorySection && <MobileNavigation />}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto border-x border-app-border ">
        <div className={`${isCategorySection ? 'pt-0' : 'pt-14'} md:pt-0`}>
          {children}
        </div>
        {showBottomTab && <MobileBottomTab />}
      </main>
    </React.Fragment>
  );
};
