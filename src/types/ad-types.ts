export type AdType = 'Sponsored' | 'Banner';
export type AdStatus = 'pending' | 'approved' | 'rejected';
export type AdPlan = 'Basic' | 'Professional' | 'Enterprise';
export type AdCTA =
  | 'Learn More'
  | 'Get Started'
  | 'Sign Up'
  | 'Buy Now'
  | 'Download Now';

type AdAuthor = {
  name: string;
  username: string;
  avatar: string;
  id: string;
};

export interface AdProps {
  id: string;
  author: AdAuthor;
  type: AdType;
  plan: AdPlan;
  price: number;
  status: AdStatus;
  submittedDate: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  content?: string; // for sponsored ads
  targetUrl: string; // for banner ads
  imageUrl?: string; // for banner ads
  callToAction?: AdCTA;
  title: string;
  category: string;
}
