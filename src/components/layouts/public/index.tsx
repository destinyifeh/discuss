'use client';
import React from 'react';

import {AppFooter} from '@/components/app-footer';
import Link from 'next/link';
import AppContainer from '..';

type PublicLayoutProps = {
  children: React.ReactNode;
};

export const PublicLayout = ({children}: PublicLayoutProps) => {
  return (
    <AppContainer>
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#0A66C2]">
              Discussday
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-[#0A66C2] transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-[#0A66C2] text-white px-4 py-2 rounded-md hover:bg-[#084e96] transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="">{children}</main>

      <AppFooter />
    </AppContainer>
  );
};
