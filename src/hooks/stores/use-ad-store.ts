import {AdCTA, AdProps} from '@/types/ad-types';
import {create} from 'zustand';

type States = {
  currentBannerIndex: Record<string, number>;
  previewAdData: AdProps;
};

type Actions = {
  setCurrentBannerIndex: (section: string, index: number) => void;
  setPreviewAdData: (data: AdProps) => void;
  startBannerRotation: (section: string, adsLength: number) => void;
};

const initialState: States = {
  currentBannerIndex: {},
  previewAdData: {
    author: {
      name: 'Janet',
      username: 'fitnesspro',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Janet',
      id: 'user_001',
    },
    type: 'Sponsored',
    title: '',
    content: '',
    imageUrl: '',
    plan: 'professional',
    section: '',
    price: '',
    status: 'pending',
    targetUrl: '',
    callToAction: AdCTA.LearnMore,
    duration: '',
  },
};

const intervals: Record<string, NodeJS.Timeout> = {};
const startedCategories: Record<string, boolean> = {};
export const useAdStore = create<States & Actions>(set => ({
  ...initialState,

  setPreviewAdData(data) {
    set({previewAdData: data});
  },
  setCurrentBannerIndex: (section, index) => {
    // console.log(section, 'ad cat');
    set(state => ({
      currentBannerIndex: {
        ...state.currentBannerIndex,
        [section]: index,
      },
    }));
  },
  startBannerRotation: (section, adsLength) => {
    console.log(section, 'ad cat');
    if (intervals[section]) return; // already running

    intervals[section] = setInterval(() => {
      console.log(section, 'ad cat22');
      set(state => {
        const prevIndex = state.currentBannerIndex[section] || 0;
        const nextIndex = (prevIndex + 1) % adsLength;

        return {
          currentBannerIndex: {
            ...state.currentBannerIndex,
            [section]: nextIndex,
          },
        };
      });
    }, 10000);
  },
}));
