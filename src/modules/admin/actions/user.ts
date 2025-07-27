import api from '@/lib/auth/api';
import {Role} from '@/types/user.types';

export interface AdminUserProps {
  _id: string;
  name: string;
  username: string;
  status: string;
  avatar?: string;
  postCount: number;
  email?: string;
  role: Role;
}

export interface AccountRestrictionPayloadProps {
  action: string;
  reason: string;
  period: string;
  userId: string;
}

class AdminUserService {
  async getAllUsersWithPostCount(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit};
    if (search) params.search = search;

    const response = await api.get(`/admin/users`, {params});
    return response.data;
  }
  async getUserDistribution() {
    const response = await api.get(`/admin/user-distribution`);
    return response.data;
  }

  async getUserDistributionAndStats() {
    const response = await api.get(`/admin/user-distribution-and-stats`);
    return response.data;
  }

  async getUserStats() {
    const response = await api.get(`/admin/user-stats`);
    return response.data;
  }

  async accountRestrictionAction(payload: AccountRestrictionPayloadProps) {
    try {
      const response = await api.patch(
        `/admin/users/${payload.userId}/action`,
        payload,
      );
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async updateUserRole(payload: {userId: string; role: Role}) {
    try {
      const response = await api.patch(
        `/admin/update-role/${payload.userId}?role=${payload.role}`,
      );
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }
}

export const adminService = new AdminUserService();
