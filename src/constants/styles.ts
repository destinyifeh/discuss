import {ThemeProps} from '@/types/global-types';
import {
  Lato,
  Nunito,
  Oswald,
  Pacifico,
  Poppins,
  Raleway,
  Roboto,
} from 'next/font/google';
//import {ThemeColorProps} from './app-types';

export const pacificoFont = Pacifico({
  variable: '--font-pacifico',
  weight: '400',
  subsets: ['latin'],
});

export const ralewayFont = Raleway({
  // variable: '--font-ra',
  // weight: '400',
  subsets: ['latin'],
});

export const oswaldFont = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
});

export const poppinsFont = Poppins({
  weight: '400',
  subsets: ['latin'],
});

export const robotoFont = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export const nunitoFont = Nunito({
  weight: '400',
  subsets: ['latin'],
});

export const latoFont = Lato({
  weight: '400',
  subsets: ['latin'],
});

export const defaultTheme: ThemeProps = {
  type: 'default',
  text: '#000000',
  background: '#fff',
};

export const darkTheme: ThemeProps = {
  type: 'dark',
  text: '#57657A',
  background: '#151718',
};

export const ISDEFAULT_THEME = 'default';
export const ISDARK_THEME = 'dark';
