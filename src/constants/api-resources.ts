export const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY;

export const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const GOOGLE_SIGNIN_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`;

export const SESSION_EXPIRED = 'sessionExpired';

export const MIN_AD_IMAGE_WIDTH = 1200;
export const MIN_AD_IMAGE_HEIGHT = 900;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
