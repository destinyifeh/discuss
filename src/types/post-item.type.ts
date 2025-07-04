export interface PostProps {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  sectionId: string;
  title: string;
  content: string;
  timestamp: Date | string;
  likes: number;
  reposts: number;
  bookmarks: number;
  comments?: number;
  views?: number;
  images?: string[];
  links?: string[];
  likedBy?: string[];
  isSponsored?: boolean;
  allowComments?: boolean;
  sponsor?: string;
  section?: string;
}

export interface CommentProps {
  id: string;
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string | Date;
  likes: number;
  verified: boolean;
  image?: string;
  commentId?: string;
}

export interface AdvertisementProps {
  id: string;
  userId: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  sponsor: string;
  adType: 'banner' | 'post' | 'fullwidth';
  categories: string[];
  plan: 'Basic' | 'Professional' | 'Enterprise';
  duration: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
  allowComments?: boolean;
  likes?: number;
  comments?: number;
  views?: number;
  reposts?: number;
  impressions?: number; // Number of times ad was shown
  clicks?: number; // Number of clicks on ad
  ctr?: number; // Click-through rate
}
