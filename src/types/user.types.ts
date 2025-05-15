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
