export interface UserUpdateRequestProps {
  username?: string;
  avatar?: File;
  bio?: string;
  dob?: string;
  gender?: string;
  website?: string;
  location?: string;
  coverAvatar?: File;
}

export interface RegisterRequestProps {
  username: string;
  avatar?: File | null;
  password: string;
  email: string;
  confirmPassword?: string;
}

export interface LoginRequestProps {
  username: string;
  password: string;
}

export interface ResetRequestProps {
  token: string;
  password: string;
}
