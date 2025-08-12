import api from '@/lib/auth/api';
import {AdStatus} from '@/types/ad-types';

class AdminAdService {
  async getAds(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit};

    if (search) params.search = search;

    const response = await api.get(`/ad`, {params});
    return response.data?.data;
  }

  async approveAd(data: {adId: string; ownerId: string}) {
    const response = await api.patch(
      `/ad/${data.adId}/approve/${data.ownerId}`,
    );
    return response.data;
  }

  async activateAd(data: {adId: string; ownerId: string}) {
    const response = await api.patch(
      `/ad/${data.adId}/activate/${data.ownerId}`,
    );
    return response.data;
  }

  async getCountAdByStatus(status: AdStatus) {
    const response = await api.get(`/ad/count-by-status?status=${status}`);
    return response.data;
  }

  async rejectAd(data: {adId: string; reason: string; ownerId: string}) {
    const response = await api.patch(
      `/ad/${data.adId}/reject/${data.ownerId}`,
      {reason: data.reason},
    );
    return response.data;
  }

  async pauseAd(data: {adId: string; reason: string; ownerId: string}) {
    const response = await api.patch(`/ad/${data.adId}/pause/${data.ownerId}`, {
      reason: data.reason,
    });
    return response.data;
  }

  async resumeAd(adId: string) {
    const response = await api.patch(`/ad/${adId}/resume`);
    return response.data;
  }

  async deleteAd(adId: string) {
    const response = await api.delete(`/ad/${adId}delete`);
    return response.data;
  }
}

export const adminAdService = new AdminAdService();
