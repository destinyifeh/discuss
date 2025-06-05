import {defaultTheme} from '@/constants/styles';
import {ThemeProps} from '@/types/global-types';
import {create} from 'zustand';

type States = {
  showBottomTab: boolean;
  theme: ThemeProps;
};

type Actions = {
  setShowBottomTab: (state: boolean) => void;
  setTheme: (theme: ThemeProps) => void;
};

const initialState: States = {
  showBottomTab: true,
  theme: defaultTheme,
};

export const useGlobalStore = create<States & Actions>(set => ({
  ...initialState,
  setShowBottomTab(state) {
    console.log(state, 'state');
    set({showBottomTab: state});
  },
  setTheme: (theme: ThemeProps) => {
    console.log('themeColor:', theme);
    //localStorage.setItem('theme', theme.type);
    set({theme: theme});
  },
}));
