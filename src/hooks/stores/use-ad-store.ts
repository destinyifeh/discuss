import {create} from 'zustand';

type States = {
  currentBannerIndex: Record<string, number>;
};

type Actions = {
  setCurrentBannerIndex: (category: string, index: number) => void;

  startBannerRotation: (category: string, adsLength: number) => void;
};

const initialState: States = {
  currentBannerIndex: {},
};

const intervals: Record<string, NodeJS.Timeout> = {};
const startedCategories: Record<string, boolean> = {};
export const useAdStore = create<States & Actions>(set => ({
  ...initialState,

  setCurrentBannerIndex: (category, index) => {
    // console.log(category, 'ad cat');
    set(state => ({
      currentBannerIndex: {
        ...state.currentBannerIndex,
        [category]: index,
      },
    }));
  },
  startBannerRotation: (category, adsLength) => {
    console.log(category, 'ad cat');
    if (intervals[category]) return; // already running

    intervals[category] = setInterval(() => {
      console.log(category, 'ad cat22');
      set(state => {
        const prevIndex = state.currentBannerIndex[category] || 0;
        const nextIndex = (prevIndex + 1) % adsLength;

        return {
          currentBannerIndex: {
            ...state.currentBannerIndex,
            [category]: nextIndex,
          },
        };
      });
    }, 10000);
  },
}));
