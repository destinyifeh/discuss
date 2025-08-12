'use client';

import {
  AdPerformanceCard,
  AdPerformancePlaceholder,
} from '@/components/ad/ad-performace-card';
import {PageHeader} from '@/components/app-headers';

import {FallbackMessage} from '@/components/fallbacks';
import AdPerformanceCardSkeleton from '@/components/skeleton/adPerformance-card-skeleton';
import {Button} from '@/components/ui/button';
import {useInfiniteQuery} from '@tanstack/react-query';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {
  CSSProperties,
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {VirtuosoGrid, VirtuosoHandle} from 'react-virtuoso';
import {adService} from '../../actions/ad.actions';
import {AdPerformanceNav} from './components/ad-performance-nav';

type AdStatus =
  | 'pending'
  | 'approved'
  | 'paused'
  | 'rejected'
  | 'active'
  | 'expired';

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
    case 'paused':
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

  const [isLoading, setIsLoading] = useState(true);

  const [showGoUp, setShowGoUp] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [mounted, setMounted] = useState(false);
  const lastScrollTop = useRef(0);

  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['user-adPerformance-data', filteredStatus],
    queryFn: ({pageParam = 1}) =>
      adService.getUserAdByStatus(pageParam, 10, filteredStatus),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
  });

  const adData = useMemo(() => {
    return data?.pages?.flatMap(page => page.ads) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('user ad dataa', adData);

  useEffect(() => {
    // Simulate loading
    //setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleMakePayment = (adId: string) => {
    navigate.push(`/payment/${adId}`);
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  // if (isLoading) {
  //   return <AdPerformanceSkeleton />;
  // }

  if (status === 'error') {
    return (
      <FallbackMessage
        message="Oops! Something went wrong"
        buttonText="Back to Home"
        page="/home"
      />
    );
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
        {adData.length === 0 ? (
          <AdPerformancePlaceholder />
        ) : (
          <VirtuosoGrid
            className="custom-scrollbar hide-scrollbar overflow-y-auto"
            style={{height: '100%'}}
            ref={virtuosoRef}
            onScroll={handleScroll}
            totalCount={totalCount}
            data={adData}
            endReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            itemContent={(index, item) => {
              if (status === 'pending') {
                return <AdPerformanceCardSkeleton />;
              }
              if (!item) {
                return <AdPerformancePlaceholder />;
              }
              return <AdPerformanceCard ad={item} key={item._id} />;
            }}
            components={{
              ...gridComponents,

              // EmptyPlaceholder: () => <AdPerformancePlaceholder />,
            }}
          />
        )}
      </div>

      {showGoUp && (
        <button
          onClick={() => {
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
          <ArrowUp size={20} />
        </button>
      )}
      {adData?.length && (
        <div className="mt-10 mb-20 md:mb-5 text-center">
          <Button
            onClick={() => navigate.push('/advertise')}
            className="bg-app hover:bg-app/90 dark:bg-app-/90 dark:hover:bg-app text-white">
            Create New Advertisement <ArrowRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
