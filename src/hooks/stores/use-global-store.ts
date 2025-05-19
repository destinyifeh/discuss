import {create} from 'zustand';

type States = {
  showBottomTab: boolean;
};

type Actions = {
  setShowBottomTab: (state: boolean) => void;
};

const initialState: States = {
  showBottomTab: true,
};

export const useGlobalStore = create<States & Actions>(set => ({
  ...initialState,
  setShowBottomTab(state) {
    console.log(state, 'state');
    set({showBottomTab: state});
  },
}));
