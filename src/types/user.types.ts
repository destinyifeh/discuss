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
  id: string;
  type: 'like' | 'reply' | 'follow' | 'mention';
  user: {
    username: string;
    displayName: string;
    avatar: string;
  };
  content: string;
  postId?: string;
  timestamp: string;
  read: boolean;
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  ADVERTISER = 'advertiser',
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
  avatar_public_id: string | null;
  cover_avatar: string | null;
  cover_avatar_public_id: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  dob: string | null; // ISO date or null
  followers: string[]; // array of User IDs
  following: string[]; // array of User IDs
  roles: Role[]; // e.g. ['user', 'admin']
  status: AccountStatus;
  statusHistory: string[]; // or a dedicated type if needed
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAdvertiser: boolean;
  isBanned: boolean;
  banReason: string | null;
  suspendedUntil: string | null; // ISO date or null
  suspensionReason: string | null;
  warnings: string[]; // IDs or messages
  googleId: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null; // ISO date or null
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
