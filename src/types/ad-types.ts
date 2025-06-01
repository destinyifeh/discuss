export type AdType = 'Sponsored' | 'Banner';
export type AdStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'expired';

export type AdPlan = 'basic' | 'professional' | 'enterprise';
// export type AdCTA =
//   | 'Learn More'
//   | 'Sign Up'
//   | 'Get Started'
//   | 'Shop Now'
//   | 'Download'
//   | 'Register Now'
//   | 'Buy Now'
//   | 'Discover More'
//   | 'Install App'
//   | 'Pre-Order Now'
//   | 'Join Now'
//   | 'Explore Features'
//   | 'See How It Works'
//   | 'View Demo'
//   | 'Subscribe Now'
//   | 'Claim Offer'
//   | 'Contact Us'
//   | 'Request Access'
//   | 'Start Now';

export enum AdCTA {
  LearnMore = 'Learn More',
  SignUp = 'Sign Up',
  GetStarted = 'Get Started',
  ShopNow = 'Shop Now',
  DownloadNow = 'Download',
  RegisterNow = 'Register Now',
  BuyNow = 'Buy Now',
  DiscoverMore = 'Discover More',
  InstallApp = 'Install App',
  PreOrderNow = 'Pre-Order Now',
  JoinNow = 'Join Now',
  ExploreFeatures = 'Explore Features',
  SeeHowItWorks = 'See How It Works',
  ViewDemo = 'View Demo',
  SubscribeNow = 'Subscribe Now',
  ClaimOffer = 'Claim Offer',
  ContactUs = 'Contact Us',
  RequestAccess = 'Request Access',
  StartNow = 'Start Now',
}

type AdAuthor = {
  name: string;
  username: string;
  avatar: string;
  id: string;
};

export interface AdProps {
  id?: string;
  author?: AdAuthor;
  type: AdType;
  plan: AdPlan;
  price?: number | string;
  status: AdStatus;
  submittedDate?: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  content?: string; // for sponsored ads
  targetUrl: string; // for banner ads
  imageUrl?: string; // for banner ads
  callToAction?: AdCTA;
  title: string;
  section: string;
  duration?: string;
  sponsor?: string;
}

export type DurationValue = '7' | '14' | '30';

export interface DurationOption {
  value: DurationValue;
  label: string;
  price: string;
  discount?: string;
}

export interface AdPerformanceData {
  id: string;
  title: string;
  description: string;
  plan: string;
  adType: string;
  section: string;
  status: AdStatus;
  impressions: number;
  clicks: number;
  ctr: number;
  startDate?: string;
  endDate?: string;
  cost: number;
  rejectionReason?: string;
  image?: string;
}
