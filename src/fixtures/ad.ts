import {
  BASIC_AD_PRICE_FOR_7_DAYS,
  BASIC_AD_PRICE_FOR__14_DAYS,
  BASIC_AD_PRICE_FOR__30_DAYS,
  ENTERPRISE_AD_PRICE_FOR_7_DAYS,
  ENTERPRISE_AD_PRICE_FOR__14_DAYS,
  ENTERPRISE_AD_PRICE_FOR__30_DAYS,
  PROFESSIONAL_AD_PRICE_FOR_7_DAYS,
  PROFESSIONAL_AD_PRICE_FOR__14_DAYS,
  PROFESSIONAL_AD_PRICE_FOR__30_DAYS,
} from '@/constants/config';
import {AdPlan, DurationOption, DurationValue} from '@/types/ad-types';

export const pricingTiers = [
  {
    name: 'Basic',
    price: BASIC_AD_PRICE_FOR_7_DAYS,
    unit: 'per week',
    description: 'For small businesses just getting started with advertising',
    features: [
      'Single section targeting',
      'Banner or post ad format',
      'Basic analytics',
      'Email support',
    ],
    limitations: ['No homepage placement', 'Standard ad rotation'],
  },
  {
    name: 'Professional',
    price: PROFESSIONAL_AD_PRICE_FOR_7_DAYS,
    unit: 'per week',
    description: 'For growing businesses looking to expand their reach',
    featured: true,
    features: [
      'Section targeting',
      'Homepage placement',
      'Post detail page visibility',
      'All ad formats',
      'Detailed analytics',
      'Priority ad rotation',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: ENTERPRISE_AD_PRICE_FOR_7_DAYS,
    unit: 'per week',
    description: 'For established businesses wanting maximum exposure',
    features: [
      'Multi-section targeting',
      'Premium homepage placement',
      'All ad formats',
      'Advanced analytics',
      'Highest priority ad rotation',
      'Dedicated support',
      'Audience retargeting',
    ],
  },
];

export const ctaBtn = [
  {name: 'Learn More'},
  {name: 'Sign Up'},
  {name: 'Get Started'},
  {name: 'Shop Now'},

  {name: 'Download Now'},

  {name: 'Register Now'},

  {name: 'Buy Now'},
  {name: 'Discover More'},
  {name: 'Install App'},
  {name: 'Pre-Order Now'},
  {name: 'Join Now'},
  {name: 'Explore Features'},
  {name: 'See How It Works'},

  {name: 'View Demo'},
  {name: 'Subscribe Now'},
  {name: 'Claim Offer'},
  {name: 'Contact Us'},
  {name: 'Request Access'},
  {name: 'Start Now'},
];

export const enterPriseAdTypes = [
  {
    id: 'banner',
    name: 'Banner Ad',
    description: 'Static or animated banner displayed on various pages',
    price: `From ${ENTERPRISE_AD_PRICE_FOR_7_DAYS}/week`,
  },
  {
    id: 'sponsored',
    name: 'Sponsored Post',
    description: 'Native-looking sponsored posts in feeds',
    price: `From ${ENTERPRISE_AD_PRICE_FOR_7_DAYS}/week`,
  },
];

export const professionalAdTypes = [
  {
    id: 'banner',
    name: 'Banner Ad',
    description: 'Static or animated banner displayed on various pages',
    price: `From ${PROFESSIONAL_AD_PRICE_FOR_7_DAYS}/week`,
  },
  {
    id: 'sponsored',
    name: 'Sponsored Post',
    description: 'Native-looking sponsored posts in feeds',
    price: `From ${PROFESSIONAL_AD_PRICE_FOR_7_DAYS}/week`,
  },
];
export const basicAdTypes = [
  {
    id: 'banner',
    name: 'Banner Ad',
    description: 'Static or animated banner displayed on various pages',
    price: `From ${BASIC_AD_PRICE_FOR_7_DAYS}/week`,
  },
  {
    id: 'sponsored',
    name: 'Sponsored Post',
    description: 'Native-looking sponsored posts in feeds',
    price: `From ${BASIC_AD_PRICE_FOR_7_DAYS}/week`,
  },
];

export const durations: DurationOption[] = [
  {value: '7', label: '7 Days', price: '$49.99', discount: ''},
  {value: '14', label: '14 Days', price: '$89.99', discount: 'Save 10%'},
  {value: '30', label: '30 Days', price: '$149.99', discount: 'Save 20%'},
];

export const enterpriseDurations: DurationOption[] = [
  {value: '7', label: '7 Days', price: '₦34,020', discount: ''},
  {value: '14', label: '14 Days', price: '₦61,236', discount: 'Save 10%'},
  {value: '30', label: '30 Days', price: '₦108,864', discount: 'Save 20%'},
];

export const professionalDurations: DurationOption[] = [
  {value: '7', label: '7 Days', price: '₦18,900', discount: ''},
  {value: '14', label: '14 Days', price: '₦34,020', discount: 'Save 10%'},
  {value: '30', label: '30 Days', price: '₦60,480', discount: 'Save 20%'},
];

export const basicDurations: DurationOption[] = [
  {value: '7', label: '7 Days', price: '₦10,500', discount: ''},
  {value: '14', label: '14 Days', price: '₦17,010', discount: 'Save 10%'},
  {value: '30', label: '30 Days', price: '₦33,600', discount: 'Save 20%'},
];

export const adPriceFormatter = (duration: string, plan: string) => {
  const PRICE_MAP = {
    basic: {
      '7': BASIC_AD_PRICE_FOR_7_DAYS,
      '14': BASIC_AD_PRICE_FOR__14_DAYS,
      '30': BASIC_AD_PRICE_FOR__30_DAYS,
    },
    professional: {
      '7': PROFESSIONAL_AD_PRICE_FOR_7_DAYS,
      '14': PROFESSIONAL_AD_PRICE_FOR__14_DAYS,
      '30': PROFESSIONAL_AD_PRICE_FOR__30_DAYS,
    },
    enterprise: {
      '7': ENTERPRISE_AD_PRICE_FOR_7_DAYS,
      '14': ENTERPRISE_AD_PRICE_FOR__14_DAYS,
      '30': ENTERPRISE_AD_PRICE_FOR__30_DAYS,
    },
  };

  return PRICE_MAP[plan as AdPlan]?.[duration as DurationValue] ?? 0;
};

export const BASIC_PLAN_DESCRIPTION =
  'Reach your ideal audience with the Basic plan—promote your ad in a single section, perfect for focused exposure as a banner or sponsored post.';

export const PROFESSIONAL_PLAN_DESCRIPTION =
  'Boost your brand with the Professional plan—your ad appears on the homepage and in a highly relevant section, driving more visibility and engagement.';

export const ENTERPRISE_PLAN_DESCRIPTION =
  'Maximize your impact with the Enterprise plan—your ad is featured across the homepage, article pages, and multiple sections for premium, all-around exposure.';
