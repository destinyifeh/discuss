import {CreateAdDto} from '@/modules/dashboard/advertise/dto/create-ad.dto';
import {AdCTA} from '@/types/ad-types';
import {create} from 'zustand';

type States = {
  currentBannerIndex: Record<string, number>;
  previewAdData: CreateAdDto;
};

type Actions = {
  setCurrentBannerIndex: (section: string, index: number) => void;
  setPreviewAdData: (data: CreateAdDto) => void;
  startBannerRotation: (section: string, adsLength: number) => void;
};

const initialState: States = {
  currentBannerIndex: {},
  previewAdData: {
    title: '',
    content: '',
    targetUrl: '',
    type: 'sponsored',
    section: '',
    callToAction: 'Learn More' as AdCTA,
    duration: '7',
    plan: 'basic',
    price: '',
    imageUrl: '',
    image: null,
  },
};

const intervals: Record<string, NodeJS.Timeout> = {};
const startedCategories: Record<string, boolean> = {};
export const useAdStore = create<States & Actions>(set => ({
  ...initialState,

  setPreviewAdData(data: CreateAdDto) {
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
