import api from '@/lib/auth/api';
import {AdPlan} from '@/types/ad-types';

class FeedService {
  async getHomePostFeeds(
    page = 1,
    limit = 10,
    search?: string,
    pattern: string = '4, 9, 15',
    adPlan: AdPlan = 'enterprise',
    mode: string = 'pattern',
  ) {
    const params: any = {page, limit, mode};
    if (search) params.search = search;
    if (pattern) params.pattern = pattern;
    if (adPlan) params.adPlan = adPlan;

    const response = await api.get(`/feeds`, {params});
    return response.data?.data;
  }

  async getSectionPostFeeds(
    page = 1,
    limit = 10,
    section: string,
    pattern: string = '',
    adPlan: AdPlan = 'enterprise',
    mode: string = 'random',
  ) {
    const params: any = {page, limit, section, mode};

    if (pattern) params.pattern = pattern;
    if (adPlan) params.adPlan = adPlan;

    const response = await api.get(`/feeds`, {params});
    return response.data?.data;
  }

  async getUserBookmarkedPostFeeds(
    page = 1,
    limit = 10,
    onlyBookmarked: boolean = true,
    pattern: string = '',
    adPlan: AdPlan = 'enterprise',
    mode: string = 'random',
  ) {
    const params: any = {page, limit, onlyBookmarked, mode};

    if (pattern) params.pattern = pattern;
    if (adPlan) params.adPlan = adPlan;

    const response = await api.get(`/feeds`, {params});
    return response.data?.data;
  }
}

export const feedService = new FeedService();
