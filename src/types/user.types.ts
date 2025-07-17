export interface UserTypes {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  bio?: string;
  following?: string[];
  followers?: string[];
  joined?: Date;
  email?: string;
}

export interface NotificationItemProps {
  _id: string;
  type: 'liked' | 'replied' | 'followed' | 'mentioned' | 'warning';
  senderName: string;
  displayName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum AccountStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
}
export interface UserProps {
  _id: string; // Mongo ObjectId as string
  email: string;
  username: string;
  avatar: string | null;
  cover_avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  dob: string | null; // ISO date or null
  followers: string[]; // array of User IDs
  following: string[]; // array of User IDs
  role: Role; // e.g. ['user', 'admin']
  status: AccountStatus;
  statusHistory: string[]; // or a dedicated type if needed
  banReason: string | null;
  suspendedUntil: string | null; // ISO date or null
  suspensionReason: string | null;
  warnings: string[]; // IDs or messages
  googleId: string | null;
  createdAt: string; // ISO date
}
