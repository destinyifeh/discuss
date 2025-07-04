import api from '@/lib/auth/api';
import {
  removeAccessToken,
  removeRefreshToken,
} from '@/lib/client/local-storage';
import {
  removeCookieAccessToken,
  removeCookieRefreshToken,
  saveCookieAccessToken,
  saveCookieRefreshToken,
} from '@/lib/server/cookies';
import {AxiosResponse} from 'axios';
import {redirect} from 'next/navigation';
import {
  LoginRequestProps,
  RegisterRequestProps,
  ResetRequestProps,
  UserUpdateRequestProps,
} from './types';

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

export async function loginRequestAction2(data: LoginRequestProps) {
  try {
    const {
      data: {access_token, refresh_token, user},
    } = await api.post('/auth/login', data);

    await saveCookieAccessToken(access_token);
    await saveCookieRefreshToken(refresh_token);

    return {user, access_token, refresh_token};
  } catch (err) {
    // ① Is it an Axios error?
    // if (axios.isAxiosError(err)) {
    //   const status = err.response?.status ?? 500;
    //   const message =
    //     err.response?.data?.message ?? err.response?.data?.error ?? err.message;

    //   console.error('loginRequestAction Axios error:', status, message);

    //   // ② Forward a clean, serialisable error object
    //   throw new Error(message);
    // }

    // ③ Non‑Axios error – rethrow as is
    console.error('loginRequestAction failed:', err);
    throw err;
  }
}

export async function loginRequestAction(data: LoginRequestProps) {
  return await api.post('/auth/login', data);
}

export async function logoutRequestAction() {
  await removeCookieAccessToken();
  await removeCookieRefreshToken();
  removeAccessToken();
  removeRefreshToken();
  redirect('/login');
}

export async function forgotPasswordRequestAction(
  data: object,
): Promise<AxiosResponse> {
  return await api.post('/auth/forgot-password', data);
}

export async function resetPasswordRequestAction(
  data: ResetRequestProps,
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

export async function changePasswordRequestAction(
  data: object,
): Promise<AxiosResponse> {
  return await api.patch('/auth/change-password', data);
}
