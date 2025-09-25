'use client';
import React from 'react';

import {usePathname} from 'next/navigation';
import AppContainer from '..';
import {MainLayout} from './main-layout';
import MobileNavigation from './mobile-navigation';
import {SidebarLayoutLeft, SidebarLayoutRight} from './sidebar-layout';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({children}: DashboardLayoutProps) => {
  const location = usePathname();
  const isExcludedRoutes =
    location.includes('/home') ||
    location.includes('/profile/') ||
    location.includes('/bookmarks') ||
    location.includes('/explore') ||
    location.includes('/discuss/');

  return (
    <AppContainer>
      {!isExcludedRoutes && <MobileNavigation />}
      <div className="flex flex-row justify-between pb-4 px-1 bg-app-background w-full">
        <SidebarLayoutLeft />
        <MainLayout>{children}</MainLayout>
        <SidebarLayoutRight />
      </div>
    </AppContainer>
  );
};
