import {DashboardLayout} from '@/components/layouts/dashboard';
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

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({children}: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
