'use client';
import {Posts, SectionOptions, Sections} from '@/constants/data';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {feedService} from '@/modules/dashboard/actions/feed.actions';
import {useInfiniteQuery} from '@tanstack/react-query';
import {BookmarkIcon, PenSquare, Search} from 'lucide-react';
import {useRouter} from 'next/navigation';
import List from 'rc-virtual-list';
import {useEffect, useMemo, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {useDebounce} from 'use-debounce';
import AdCard from '../ad/ad-card';
import {BannerAds} from '../ad/banner';
import {PageHeader, SectionHeader} from '../app-headers';
import {LoadingMore, LoadMoreError} from '../feedbacks';
import ErrorFeedback from '../feedbacks/error-feedback';
import SearchBarList from '../forms/list-search-bar';
import {MobileBottomTab} from '../layouts/dashboard/mobile-bottom-tab';
import MobileNavigation from '../layouts/dashboard/mobile-navigation';
import {HomeDashboardSkeleton} from '../skeleton/home-dashboard-skeleton';
import PostSkeleton from '../skeleton/post-skeleton';
import {Badge} from '../ui/badge';
import {Button} from '../ui/button';
import {Tabs, TabsList, TabsTrigger} from '../ui/tabs';
import PostCard from './post-card';

export const SectionPostList = ({
  bannerAd,
  section,
  title,
  description,
}: {
  bannerAd: string;
  section: string;
  title: string;
  description: string;
}) => {
  const lastScrollTop = useRef(0);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const {setShowBottomTab} = useGlobalStore(state => state);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const navigate = useRouter();
  const shouldQuery = !!section;
  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['section-feed-posts', section],
    queryFn: ({pageParam = 1}) =>
      feedService.getSectionPostFeeds(pageParam, 10, section),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    enabled: shouldQuery,
    retry: 1,
    // refetchInterval: 5000, // Poll every 5s
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });

  const sectionData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log(data, 'section dataa');

  // Scroll handler
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide
      setShowMobileNav(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up → show
      setShowMobileNav(true);
    }

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  return (
    <div>
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <SectionHeader title={title} description={description} />
      </div>
      <div className="hidden lg:block">
        <SectionHeader title={title} description={description} />
      </div>

      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        onScroll={handleScroll}
        ref={virtuosoRef}
        data={sectionData}
        components={{
          Header: () => (
            <div className="mt-25 lg:mt-0">
              <BannerAds section={bannerAd} placement="section_feed" />
            </div>
          ),
          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return <SectionPlaceholder section={section} />;
          },

          Footer: () =>
            status === 'error' ? (
              <ErrorFeedback
                showRetry
                onRetry={refetch}
                message="We encountered an unexpected error. Please try again"
                variant="minimal"
              />
            ) : isFetchingNextPage ? (
              <LoadingMore />
            ) : fetchNextError ? (
              <LoadMoreError
                fetchNextError={fetchNextError}
                handleFetchNext={handleFetchNext}
              />
            ) : null,
        }}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            handleFetchNext();
          }
        }}
        itemContent={(index, post) => {
          if (status === 'pending') {
            return <PostSkeleton />;
          } else {
            if (!post || !post.data) {
              return null;
            }
            if (post._type === 'ad') {
              return (
                <AdCard key={post.data._id || `ad-${index}`} ad={post.data} />
              );
            }
            return (
              <PostCard
                key={post.data._id || `post-${index}`}
                post={post.data}
              />
            );
          }
        }}
      />

      <div>
        <Button
          className="fixed bottom-6 h-14 w-14 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition"
          // className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-app hover:bg-app/90 text-white"
          size="icon"
          onClick={() => {
            navigate.push(`/discuss?section=${section.toLowerCase()}`);
          }}>
          <PenSquare size={24} />
        </Button>
      </div>
    </div>
  );
};

export const HomePostList = () => {
  const lastScrollTop = useRef(0);

  const [showBottomTab, setShowBottomTab] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useRouter();
  const {currentUser} = useAuthStore(state => state);
  console.log(currentUser, 'currentooo');
  const [mounted, setMounted] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  console.log(activeTab, 'activtabbb');
  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['home-feed-posts', activeTab],
    queryFn: ({pageParam = 1}) =>
      feedService.getHomePostFeeds(pageParam, 10, activeTab),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    //refetchInterval: 5000, // Poll every 5s
    refetchInterval: 15000, //poll every 15s
    refetchIntervalInBackground: false,
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleWindowScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > lastScrollTop.current) {
        setShowMobileNav(false); // scrolling down
      } else if (scrollTop < lastScrollTop.current) {
        setShowMobileNav(true); // scrolling up
      }

      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  const postsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('should query', error);

  console.log(postsData, 'should query dataa', totalCount);

  if (!mounted) return <HomeDashboardSkeleton />;

  const homeData = status === 'pending' ? Array(5).fill(null) : postsData;

  // Scroll handler
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide
      setShowBottomTab(false);
      setShowMobileNav(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up → show
      setShowBottomTab(true);
      setShowMobileNav(true);
    }

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const onSectionNavigate = (section: string) => {
    if (section === 'Create Ad') {
      navigate.push('/advertise');
      return;
    }
    navigate.push(`/discuss/${section.toLowerCase()}`);
  };

  const onSectionOptionsNavigate = (section: string) => {
    navigate.push(`/${section}`);
  };

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  const allowTab = false;
  const allowMSearch = false;

  return (
    <div>
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <MobileNavigation />
      </div>

      <Virtuoso
        className="custom-scrollbar min-h-screen mb-0 lg:mb-0"
        data={homeData}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <div className="mt-15 lg:mt-0">
              {!allowTab && (
                <Tabs
                  defaultValue="for-you"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full">
                  <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                    <TabsList className="w-full grid grid-cols-2 border-b rounded-none border-app-border">
                      <TabsTrigger
                        value="for-you"
                        className="data-[state=active]:font-bold rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:shadow-none px-6 py-3 data-[state=active]:text-black">
                        Trending
                      </TabsTrigger>
                      <TabsTrigger
                        value="following"
                        className="data-[state=active]:font-bold rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:shadow-none px-6 py-3 data-[state=active]:text-black">
                        Following
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
              )}
              <div className="px-0 py-3 mt-3 border-b border-app-border lg:hidden md:mt-7">
                <div className="px-4">
                  <h2 className="font-semibold mb-2 mt-0">Discuss</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Sections.map(section => (
                      <Badge
                        key={section.id}
                        variant="outline"
                        className="py-1 px-3 cursor-pointer hover:bg-app-hover font-bold text-app border-app-border active:scale-90 transition-transform duration-150"
                        onClick={() => onSectionNavigate(section.name)}>
                        {section.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="px-4 flex flex-wrap gap-2 mb-2 border-t pt-3 border-app-border">
                  {SectionOptions.map(section => (
                    <Badge
                      key={section.id}
                      variant="outline"
                      className="py-1 px-3 cursor-pointer hover:bg-app-hover font-bold border-app-border text-app active:scale-90 transition-transform duration-150"
                      onClick={() =>
                        onSectionOptionsNavigate(section.description as string)
                      }>
                      {section.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {!allowMSearch && (
                <div className="pt-4 px-4">
                  <div className="relative border-1 border-app-border rounded-full py-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray"
                      size={20}
                    />
                    <div
                      onClick={() => navigate.push('/explore')}
                      className="border-0 rounded-full pl-10 form-input text-gray-500 active:scale-90 transition-transform duration-150">
                      Search
                    </div>
                  </div>
                </div>
              )}
              <div>
                <BannerAds placement="homepage_feed" />
              </div>
            </div>
          ),
          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return <PostPlaceholder tab={activeTab} />;
          },

          Footer: () =>
            status === 'error' ? (
              <ErrorFeedback
                showRetry
                onRetry={refetch}
                message="We encountered an unexpected error. Please try again"
                variant="minimal"
              />
            ) : isFetchingNextPage ? (
              <LoadingMore />
            ) : fetchNextError ? (
              <LoadMoreError
                fetchNextError={fetchNextError}
                handleFetchNext={handleFetchNext}
              />
            ) : null,
        }}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            handleFetchNext();
          }
        }}
        itemContent={(index, post) => {
          if (status === 'pending') {
            return <PostSkeleton />;
          } else {
            if (!post || !post.data) {
              return null;
            }
            if (post._type === 'ad') {
              return (
                <AdCard key={post.data._id || `ad-${index}`} ad={post.data} />
              );
            }
            return (
              <PostCard
                key={post.data._id || `post-${index}`}
                post={post.data}
              />
            );
          }
        }}
      />

      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 w-full z-50 transition-transform duration-300 ${
          showBottomTab ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <MobileBottomTab />
      </div>
    </div>
  );
};

export const ExplorePostList = () => {
  const lastScrollTop = useRef(0);

  const [showBottomTab, setShowBottomTab] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const navigate = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['explore-feed-posts', debouncedSearch],
    queryFn: ({pageParam = 1}) =>
      feedService.getHomePostFeeds(pageParam, 10, undefined, debouncedSearch),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
  });
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const postsData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log('should query', error);

  console.log(postsData, 'should query dataa', totalCount);

  if (!mounted) return <HomeDashboardSkeleton />;

  const exploreData = status === 'pending' ? Array(5).fill(null) : postsData;

  // Scroll handler
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide
      setShowBottomTab(false);
      setShowMobileNav(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up → show
      setShowBottomTab(true);
      setShowMobileNav(true);
    }

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const onSectionNavigate = (section: string) => {
    if (section === 'Create Ad') {
      navigate.push('/advertise');
      return;
    }
    navigate.push(`/discuss/${section.toLowerCase()}`);
  };

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  return (
    <div>
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <PageHeader title="Search" />

        <SearchBarList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          ref={searchRef}
        />
      </div>

      <div className="hidden lg:block">
        <PageHeader title="Search" />

        <SearchBarList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          ref={searchRef}
        />
      </div>

      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        data={exploreData}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <div className="mt-27 lg:mt-0">
              <div className="px-4 py-3 border-b lg:hidden md:mt-7 border-app-border">
                <h2 className="font-semibold my-2">Discuss</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Sections.map(section => (
                    <Badge
                      key={section.id}
                      variant="outline"
                      className="py-1 px-3 cursor-pointer hover:bg-app-hover font-bold text-app border-app-border"
                      onClick={() => onSectionNavigate(section.name)}>
                      {section.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <BannerAds placement="homepage_feed" />
              </div>
              <div className="border-b-2 border-b-app p-3 w-30 mb-3 font-bold text-lg">
                <h1> Explore </h1>
              </div>
            </div>
          ),
          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return <Placeholder holder={'explore'} />;
          },

          Footer: () =>
            status === 'error' ? (
              <ErrorFeedback
                showRetry
                onRetry={refetch}
                message="We encountered an unexpected error. Please try again"
                variant="minimal"
              />
            ) : isFetchingNextPage ? (
              <LoadingMore />
            ) : fetchNextError ? (
              <LoadMoreError
                fetchNextError={fetchNextError}
                handleFetchNext={handleFetchNext}
              />
            ) : null,
        }}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            handleFetchNext();
          }
        }}
        itemContent={(index, post) => {
          if (status === 'pending') {
            return <PostSkeleton />;
          } else {
            if (!post || !post.data) {
              return null;
            }
            if (post._type === 'ad') {
              return (
                <AdCard key={post.data._id || `ad-${index}`} ad={post.data} />
              );
            }
            return (
              <PostCard
                key={post.data._id || `post-${index}`}
                post={post.data}
              />
            );
          }
        }}
      />
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 w-full z-50 transition-transform duration-300 ${
          showBottomTab ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <MobileBottomTab />
      </div>
    </div>
  );
};

export const BookmarkPostList = () => {
  const lastScrollTop = useRef(0);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [fetchNextError, setFetchNextError] = useState<string | null>(null);
  const navigate = useRouter();

  const {
    data, // This 'data' contains { pages: [], pageParams: [] }
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching, // Combines isFetching and isFetchingNextPage
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['bookmarked-feed-posts'],
    queryFn: ({pageParam = 1}) =>
      feedService.getUserBookmarkedPostFeeds(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const {page, pages} = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    placeholderData: previousData => previousData,
    retry: 1,
  });

  const bookmarkedData = useMemo(() => {
    return data?.pages?.flatMap(page => page.posts) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.pagination.totalItems ?? 0;

  console.log(data, 'bookmarked dataa');

  // Scroll handler
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    if (scrollTop > lastScrollTop.current) {
      // Scrolling down → hide
      setShowBottomTab(false);
      setShowMobileNav(false);
    } else if (scrollTop < lastScrollTop.current) {
      // Scrolling up → show
      setShowBottomTab(true);
      setShowMobileNav(true);
    }

    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const handleFetchNext = async () => {
    try {
      setFetchNextError(null);
      await fetchNextPage();
    } catch (err) {
      setFetchNextError('Failed to load more content.');
    }
  };

  return (
    <div className="lg:pb-0">
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bg-background w-full z-50 transition-transform duration-300 ${
          showMobileNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <PageHeader title="Bookmarks" />
      </div>
      <div className="hidden lg:block">
        <PageHeader title="Bookmarks" />
      </div>
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        onScroll={handleScroll}
        ref={virtuosoRef}
        data={bookmarkedData}
        components={{
          Header: () => <div className="mt-15 lg:mt-0"></div>,

          EmptyPlaceholder: () => {
            if (status === 'error') {
              return null;
            }
            if (status === 'pending') {
              return <PostSkeleton />;
            }

            return <Placeholder holder={'bookmark'} />;
          },

          Footer: () =>
            status === 'error' ? (
              <ErrorFeedback
                showRetry
                onRetry={refetch}
                message="We encountered an unexpected error. Please try again"
                variant="minimal"
              />
            ) : isFetchingNextPage ? (
              <LoadingMore />
            ) : fetchNextError ? (
              <LoadMoreError
                fetchNextError={fetchNextError}
                handleFetchNext={handleFetchNext}
              />
            ) : null,
        }}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            handleFetchNext();
          }
        }}
        itemContent={(index, post) => {
          if (status === 'pending') {
            return <PostSkeleton />;
          } else {
            if (!post || !post.data) {
              return null;
            }
            if (post._type === 'ad') {
              return (
                <AdCard key={post.data._id || `ad-${index}`} ad={post.data} />
              );
            }
            return (
              <PostCard
                key={post.data._id || `post-${index}`}
                post={post.data}
              />
            );
          }
        }}
      />

      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 w-full z-50 transition-transform duration-300 ${
          showBottomTab ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <MobileBottomTab />
      </div>
    </div>
  );
};

export const PostPlaceholder = ({tab}: {tab: string}) => {
  const navigate = useRouter();
  return (
    <div className="p-8 text-center">
      {tab === 'for-you' ? (
        <>
          <h2 className="text-xl font-bold mb-2">No posts yet</h2>
          <p className="text-app-gray">Be the first to post!</p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">No posts from your follows</h2>
          <p className="text-app-gray mb-4">
            Follow more people to see their posts here!
          </p>
          <button
            className="bg-app hover:bg-app/90 text-white px-5 py-2 rounded-full text-sm font-medium"
            onClick={() => navigate.push('/users')}>
            Find people to follow
          </button>
        </>
      )}
    </div>
  );
};

export const Placeholder = ({
  holder,
  query,
}: {
  holder: string;
  query?: string;
}) => {
  const navigate = useRouter();
  return (
    <div className="p-8 text-center">
      {holder === 'explore' && (
        <>
          <h2 className="text-xl font-bold mb-2">
            No search result for {query} found
          </h2>
          <p className="text-app-gray">Try another search!</p>
        </>
      )}
      {holder === 'bookmark' && (
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <div className="bg-app-hover rounded-full p-4 mb-4">
            <BookmarkIcon size={32} className="text-app" />
          </div>
          <h2 className="text-xl font-bold mb-2">No bookmarks yet</h2>
          <p className="text-app-gray mb-4">
            When you bookmark posts, they will appear here for easy access.
          </p>
        </div>
      )}
    </div>
  );
};

export const SectionPlaceholder = (props: {section: string}) => {
  const navigate = useRouter();
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">No discussions yet</h2>
      <p className="text-app-gray">Be the first to post in this section!</p>
      <Button
        className="mt-4 bg-app hover:bg-app/90"
        onClick={() =>
          navigate.push(`/discuss?section=${props.section.toLowerCase()}`)
        }>
        Start Discussion
      </Button>
    </div>
  );
};

export const CommentPlaceholder = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">No replies yet</h2>
      <p className="text-app-gray">Be the first to reply!</p>
    </div>
  );
};

export const PostList11 = () => {
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const itemHeight = 180; // Adjust to match your PostCard height (including padding/margin)
  const containerHeight = 800;
  return (
    <List
      data={sortedPosts}
      height={containerHeight}
      itemHeight={itemHeight}
      itemKey="id">
      {post => <div>{/* <PostCard post={post} /> */}</div>}
    </List>
  );
};
