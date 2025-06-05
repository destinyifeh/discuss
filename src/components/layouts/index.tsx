'use client';

import {useEffect} from 'react';

import {darkTheme, defaultTheme} from '@/constants/styles';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {Toaster} from '../ui/sonner';
interface AppContainerProps {
  children: React.ReactNode;
  appBackgroundColor?: string;
}
const AppContainer = ({children}: AppContainerProps) => {
  const {theme, setTheme} = useGlobalStore(state => state);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? darkTheme : defaultTheme;
      setTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);
  return (
    <div
      className={clsx('min-h-screen', {
        'default-theme': theme.type === 'default',
        'dark-theme': theme.type === 'dark',
      })}>
      {/* {`min-h-screen bg-${[theme.background]} text-${ theme.text}`}> */}
      {children}
      <Toaster position="top-center" />
    </div>
  );
};

export default AppContainer;
