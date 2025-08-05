import api from '@/lib/auth/api';
import {AxiosResponse} from 'axios';
import {CreateAdDto} from '../advertise/dto/create-ad.dto';

class AdService {
  async createdAdRequest(data: CreateAdDto): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('price', data.price);
    formData.append('duration', data.duration);
    formData.append('plan', data.plan);
    formData.append('section', data.section);
    formData.append('targetUrl', data.targetUrl);
    formData.append('callToAction', data.callToAction);
    formData.append('type', data.type);
    formData.append('title', data.title);

    if (data.image) {
      formData.append('image', data.image);
    }

    if (data.content) {
      formData.append('image', data.content);
    }

    return await api.post('/ad', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  }
}

export const adService = new AdService();
