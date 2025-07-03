'use client';

import {
  AdPerformanceCard,
  AdPerformancePlaceholder,
} from '@/components/ad/ad-performace-card';
import {PageHeader} from '@/components/app-headers';

import AdPerformanceSkeleton from '@/components/skeleton/adPerformance-skeleton';
import {Button} from '@/components/ui/button';
import {AdPerformanceData} from '@/types/ad-types';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {CSSProperties, forwardRef, ReactNode, useEffect, useState} from 'react';
import {VirtuosoGrid} from 'react-virtuoso';
import {AdPerformanceNav} from './components/ad-performance-nav';

type AdStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'expired';

const mockAds: AdPerformanceData[] = [
  {
    id: '1',
    title: 'Summer Sale',
    description: 'Get 50% off on all summer products!',
    plan: 'Professional',
    adType: 'banner',
    section: 'Shopping',
    status: 'active',
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cost: 89.99,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=Banner',
  },
  {
    id: '2',
    title: 'New Product Launch',
    description: 'Check out our brand new product line!',
    plan: 'Basic',
    adType: 'post',
    section: 'Technology',
    status: 'active',
    impressions: 1240,
    clicks: 86,
    ctr: 6.9,
    startDate: '2025-04-25',
    endDate: '2025-05-02',
    cost: 49.99,
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=Product',
  },
  {
    id: '3',
    title: 'Premium Membership',
    description: 'Join our premium membership program today!',
    plan: 'Enterprise',
    adType: 'feed',
    section: 'Services',
    status: 'pending',
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cost: 149.99,
  },
  {
    id: '4',
    title: 'Limited Time Offer',
    description: 'Special discount for our loyal customers!',
    plan: 'Basic',
    adType: 'banner',
    section: 'Shopping',
    status: 'rejected',
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cost: 49.99,
    rejectionReason:
      'Ad content violates community guidelines regarding promotional claims.',
  },
  {
    id: '6',
    title: 'Limited Time Offer',
    description: 'Special discount for our loyal customers!',
    plan: 'Basic',
    adType: 'banner',
    section: 'Shopping',
    status: 'rejected',
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cost: 49.99,
    rejectionReason:
      'Ad content violates community guidelines regarding promotional claims.',
  },
  {
    id: '7',
    title: 'Limited Time Offer',
    description: 'Special discount for our loyal customers!',
    plan: 'Basic',
    adType: 'banner',
    section: 'Shopping',
    status: 'rejected',
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cost: 49.99,
    rejectionReason:
      'Ad content violates community guidelines regarding promotional claims.',
  },
];

const getStatusColor = (status: AdStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'expired':
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: AdStatus) => {
  switch (status) {
    case 'pending':
      return <Clock size={16} />;
    case 'approved':
      return <CheckCircle size={16} />;
    case 'rejected':
      return <AlertCircle size={16} />;
    case 'active':
      return <Activity size={16} />;
    case 'expired':
      return <AlertCircle size={16} />;
  }
};

type ListProps = {
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
};

type ItemProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const gridComponents = {
  List: forwardRef<HTMLDivElement, ListProps>(
    ({style, children, className, ...props}, ref) => (
      <div
        ref={ref}
        {...props}
        className={` grid gap-4 md:grid-cols-2 px-3 ${className ?? ''}`}
        style={style}>
        {children}
      </div>
    ),
  ),
};

export const AdPerformancePage = () => {
  const navigate = useRouter();

  const [filteredStatus, setFilteredStatus] = useState<AdStatus | 'all'>('all');
  const [ads, setAds] = useState<AdPerformanceData[]>(mockAds);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const filteredAds =
    filteredStatus === 'all'
      ? ads
      : ads.filter(ad => ad.status === filteredStatus);

  const handleMakePayment = (adId: string) => {
    navigate.push(`/payment/${adId}`);
  };

  const show = false;

  if (isLoading) {
    return <AdPerformanceSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        title="Ad Performance"
        description="Manage and track your advertisements"
      />

      <AdPerformanceNav
        filteredStatus={filteredStatus}
        setFilteredStatus={setFilteredStatus}
      />

      <div className="flex-1 overflow-hidden">
        {filteredAds.length === 0 ? (
          <AdPerformancePlaceholder />
        ) : (
          <VirtuosoGrid
            className="custom-scrollbar hide-scrollbar overflow-y-auto"
            style={{height: '100%'}}
            // ref={virtuosoRef}
            // onScroll={handleScroll}

            data={filteredAds}
            itemContent={(index, item) => {
              return <AdPerformanceCard ad={item} key={item.id} />;
            }}
            components={{
              ...gridComponents,

              // EmptyPlaceholder: () => <AdPerformancePlaceholder />,
            }}
          />
        )}
      </div>

      <div className="mt-10 mb-20 md:mb-5 text-center">
        <Button
          onClick={() => navigate.push('/advertise')}
          className="bg-app hover:bg-app/90 dark:bg-app-/90 dark:hover:bg-app text-white">
          Create New Advertisement <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};
