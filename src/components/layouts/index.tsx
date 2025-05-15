'use client';

import {useEffect, useState} from 'react';

import {Toaster} from '../ui/sonner';
interface AppContainerProps {
  children: React.ReactNode;
  appBackgroundColor?: string;
}
const AppContainer = ({children}: AppContainerProps) => {
  const [theme, setTheme] = useState('');
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'black' : 'white';
      setTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);
  return (
    <div className={`min-h-screen bg-${theme} text-${theme}`}>
      {children}
      <Toaster position="top-center" />
    </div>
  );
};

export default AppContainer;
