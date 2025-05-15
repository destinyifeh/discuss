'use client';
import React from 'react';

import AppContainer from '..';
import {MainLayout} from './main-layout';
import {SidebarLayoutLeft, SidebarLayoutRight} from './sidebar-layout';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({children}: DashboardLayoutProps) => {
  return (
    <AppContainer>
      <div className="flex flex-row justify-between pb-4 px-1 bg-app-background w-full">
        <SidebarLayoutLeft />
        <MainLayout>{children}</MainLayout>
        <SidebarLayoutRight />
      </div>
    </AppContainer>
  );
};
