import {darkTheme, defaultTheme} from '@/constants/styles';
import {ThemeProps} from '@/types/global-types';
import {create} from 'zustand';

type States = {
  showBottomTab: boolean;
  theme: ThemeProps;
  item: any;
};

type Actions = {
  setShowBottomTab: (state: boolean) => void;
  setTheme: (theme: ThemeProps) => void;
  getStoredTheme: () => ThemeProps;
  setItem: (item: any) => void;
};

const initialState: States = {
  showBottomTab: true,
  theme: defaultTheme,
  item: null,
};

export const useGlobalStore = create<States & Actions>(set => ({
  ...initialState,
  setShowBottomTab(state) {
    console.log(state, 'state');
    set({showBottomTab: state});
  },
  setTheme: (theme: ThemeProps) => {
    console.log('themeColor:', theme);
    localStorage.setItem('theme', theme.type);
    set({theme: theme});
  },
  setItem: (item: any) => {
    set({item: item});
  },
  getStoredTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'default' ? defaultTheme : darkTheme;
    }
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    return prefersDark ? darkTheme : defaultTheme;
  },
}));
