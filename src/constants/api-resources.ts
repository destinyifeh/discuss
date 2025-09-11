export const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY;

export const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const GOOGLE_SIGNIN_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`;

export const SESSION_EXPIRED = 'sessionExpired';
