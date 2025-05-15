'use client';
import React from 'react';

import AppContainer from '..';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({children}: AuthLayoutProps) => {
  return (
    <AppContainer>
      <div className="">{children}</div>
    </AppContainer>
  );
};
