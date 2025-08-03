import api from '@/lib/auth/api';
import {UserUpdateRequestProps} from '@/modules/auth/types';
import {AxiosResponse} from 'axios';
import {UsersResponse} from './type.actions';

class UserService {
  async getFollowingRequestAction(username: string) {
    try {
      const res = await api.get(`/user/${username}/following`);
      return res.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getFollowersRequestAction(username: string) {
    try {
      const res = await api.get(`/user/${username}/followers`);
      return res.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getUserByUsername(username: string, url?: string) {
    try {
      const res = await api.get(`/user/${username}`);
      return res.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async followUserRequestAction(targetId: string): Promise<AxiosResponse> {
    return await api.patch(`/user/${targetId}/follow`);
  }

  async getUsers(): Promise<UsersResponse> {
    try {
      const response = await api.get('/user/all-users');
      return response.data?.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getAllUsers(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit};
    if (search) params.search = search;

    const response = await api.get(`/user/all-users`, {params});
    return response.data?.data;
  }

  async updateUserRequestAction(
    data: UserUpdateRequestProps,
  ): Promise<AxiosResponse> {
    const form = new FormData();

    // ---- string fields -------------------------------------------------
    if (data.username) form.append('username', data.username);
    if (data.bio) form.append('bio', data.bio);
    if (data.dob) form.append('dob', data.dob);
    if (data.gender) form.append('gender', data.gender);
    if (data.website) form.append('website', data.website);
    if (data.location) form.append('location', data.location);

    // ---- file fields ---------------------------------------------------
    if (data.avatar) form.append('avatar', data.avatar); // File
    if (data.coverAvatar) form.append('cover_avatar', data.coverAvatar); // File

    return await api.patch('/user/profile-update', form, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
  }

  async deleteUserRequest(userId: string): Promise<AxiosResponse> {
    return await api.delete(`/auth/${userId}`);
  }

  async getUserPosts(
    page = 1,
    limit = 10,
    type: string = 'posts',
    search?: string,
  ) {
    const params: any = {page, limit, type, search};

    if (search) params.search = search;
    const response = await api.get(`/posts/user-posts`, {params});
    return response.data?.data;
  }

  async getPublicUserPosts(
    page = 1,
    limit = 10,
    type: string = 'posts',
    userId: string,
    search?: string,
  ) {
    const params: any = {page, limit, type, search};

    if (search) params.search = search;
    const response = await api.get(`/posts/user-posts/${userId}`, {params});
    return response.data?.data;
  }

  async getUserPostLikes(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit, search};

    if (search) params.search = search;
    const response = await api.get(`/posts/likes`, {params});
    return response.data?.data;
  }

  async getUserPostReplies(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit, search};
    if (search) params.search = search;
    const response = await api.get(`/posts/replies`, {params});
    return response.data?.data;
  }
}

export const userService = new UserService();
