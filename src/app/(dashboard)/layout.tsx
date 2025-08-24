import {DashboardLayout} from '@/components/layouts/dashboard';
import {APP_DESCRIPTION, APP_NAME} from '@/constants/settings';
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME}-${APP_DESCRIPTION}`,
  description: APP_DESCRIPTION,
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({children}: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
