import api from '@/lib/auth/api';
import {
  LoginRequestProps,
  RegisterRequestProps,
  UserUpdateRequestProps,
} from '@/modules/auth/types';
import {AxiosResponse} from 'axios';

export async function registerRequestAction(
  data: RegisterRequestProps,
): Promise<AxiosResponse> {
  const formData = new FormData();

  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);

  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }

  return await api.post('/auth/register', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
}

export async function loginRequestAction(data: LoginRequestProps) {
  return await api.post('/auth/login', data);
}

export async function changePasswordRequestAction2(
  data: object,
): Promise<AxiosResponse> {
  return await api.patch('/auth/change-password', data);
}

export async function resetPasswordRequestAction(
  data: object,
): Promise<AxiosResponse> {
  return await api.post('/auth/reset-password', data);
}
export async function refreshTokenRequest(
  token: string,
): Promise<AxiosResponse> {
  return await api.post('/auth/refresh-token', token);
}

export async function updateUserRequest(
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
  if (data.coverAvatar) form.append('coverAvatar', data.coverAvatar); // File

  return await api.patch('/users/update', form, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
}

export async function deleteUserRequest(
  userId: string,
): Promise<AxiosResponse> {
  return await api.delete(`/auth/${userId}`);
}
