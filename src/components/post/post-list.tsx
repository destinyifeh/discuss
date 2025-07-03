'use client';
import {mockAds, Posts, SectionOptions, Sections} from '@/constants/data';
import {Fragment, useEffect, useMemo, useRef, useState} from 'react';
//import {VariableSizeList as List} from 'react-window';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {
  insertAdsAtRandomPositions,
  mergePostsWithAds,
  shuffleArray,
} from '@/lib/helpers';
import {AdProps} from '@/types/ad-types';
import {PostProps} from '@/types/post-item.type';
import {ArrowUp, BookmarkIcon, Search} from 'lucide-react';
import {useRouter} from 'next/navigation';
import List from 'rc-virtual-list';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {AdCard} from '../ad/ad-card';
import {AppBannerAd, AppBannerAd4} from '../ad/banner';
import {PageHeader} from '../app-headers';
import {MobileBottomTab} from '../layouts/dashboard/mobile-bottom-tab';
import MobileNavigation from '../layouts/dashboard/mobile-navigation';
import PostSkeleton from '../skeleton/post-skeleton';
import {Badge} from '../ui/badge';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Tabs, TabsList, TabsTrigger} from '../ui/tabs';
import PostCard from './post-card';

type MergedItem = {type: 'post'; data: PostProps} | {type: 'ad'; data: AdProps};
export const SectionPostList = ({
  adSection,
  bannerAd,
}: {
  adSection: string;
  bannerAd: string;
}) => {
  const stortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const {setShowBottomTab} = useGlobalStore(state => state);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const navigate = useRouter();
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const sortedPosts2 = [...Posts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const data = activeTab === 'for-you' ? sortedPosts : sortedPosts2;

  const sponsoredAd = mockAds.filter(
    ad => ad.type === 'Sponsored' && ad.section === adSection,
  );

  //   const [posts, setPosts] = useState([]);
  //   const [page, setPage] = useState(1);

  //   const fetchMore = async () => {
  //     const res = await fetch(`/api/posts?page=${page}`);
  //     const newPosts = await res.json();
  //     setPosts(prev => [...prev, ...newPosts]);
  //     setPage(prev => prev + 1);
  //   };

  //   useEffect(() => {
  //     fetchMore(); // Load initial
  //   }, []);

  const lastScrollTop = useRef(0);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;
    // if (scrollTop > lastScrollTop.current + 5) {
    //   setTimeout(() => {
    //     setShowBottomTab(false);
    //   }, 500);
    // } else if (scrollTop < lastScrollTop.current - 5) {
    //   setShowBottomTab(true);
    // }

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  // const mergedPosts: MergedItem[] = [];
  // const adInterval = 5;

  // for (let i = 0; i < sortedPosts.length; i++) {
  //   mergedPosts.push({type: 'post', data: sortedPosts[i]});

  //   if ((i + 1) % adInterval === 0 && sponsoredAd.length > 0) {
  //     const ad = sponsoredAd.shift();
  //     if (ad) {
  //       mergedPosts.push({type: 'ad', data: ad});
  //     }
  //   }
  // }

  // // Optionally add remaining ads at the end
  // while (sponsoredAd.length > 0) {
  //   const ad = sponsoredAd.shift();
  //   if (ad) {
  //     mergedPosts.push({type: 'ad', data: ad});
  //   }
  // }

  const showFixedAd = false;

  if (showFixedAd) {
    const mergedPosts = useMemo(() => {
      const sortedPosts = [...Posts].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      const shuffledSponsoredAds = shuffleArray(
        mockAds.filter(
          ad => ad.type === 'Sponsored' && ad.section === adSection,
        ),
      );

      const merged: MergedItem[] = [];
      let adIndex = 0;
      const adInterval = 5;

      for (let i = 0; i < sortedPosts.length; i++) {
        merged.push({type: 'post', data: sortedPosts[i]});

        if (
          (i + 1) % adInterval === 0 &&
          adIndex < shuffledSponsoredAds.length
        ) {
          merged.push({type: 'ad', data: shuffledSponsoredAds[adIndex]});
          adIndex++;
        }
      }

      // Optional: Append remaining ads
      for (; adIndex < shuffledSponsoredAds.length; adIndex++) {
        merged.push({type: 'ad', data: shuffledSponsoredAds[adIndex]});
      }

      return merged;
    }, [Posts, mockAds, adSection]);
  }

  const mergedPosts = useMemo(() => {
    const sortedPosts = [...Posts].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const sponsoredAds = mockAds.filter(
      ad => ad.type === 'Sponsored' && ad.section === adSection,
    );

    return insertAdsAtRandomPositions(sortedPosts, sponsoredAds);
  }, [Posts, mockAds, adSection]);

  const mergedItems = useMemo(() => {
    return mergePostsWithAds(sortedPosts, shuffleArray(sponsoredAd));
  }, [Posts, mockAds, adSection]);

  return (
    <div className="pb-15 lg:pb-0">
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        //style={{height: '950px', width: '100%'}}

        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <div>
              <AppBannerAd4 section={bannerAd} />
            </div>
          ),
          EmptyPlaceholder: () => <SectionPlaceholder />,
        }}
        //endReached={fetchMore}
        // data={mergedPosts}
        data={mergedItems}
        //   itemContent={(index, item) => {
        //     if ('type' in item && item.type === 'ad') {
        //       return <AdCard ad={item.data} />;
        //     }
        //     return <PostCard post={item as PostProps} />;
        //   }}
        // />

        itemContent={(index, item) => {
          if (item.type === 'ad') {
            return <AdCard ad={item.data} />;
          }
          return <PostCard post={item.data} />;
        }}
        computeItemKey={(index, item) => {
          // Ensure unique & stable keys
          if (item.type === 'ad') return `ad-${item.data.id}`;
          return `post-${item.data.id}`;
        }}
      />
      {showGoUp && (
        <button
          onClick={() => {
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export const HomePostList = () => {
  const lastScrollTop = useRef(0);

  const [showBottomTab, setShowBottomTab] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useRouter();
  const {currentUser} = useAuthStore(state => state);
  console.log(currentUser, 'currentooo');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const sortedPosts2 = [...Posts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const data2 = activeTab === 'for-you' ? sortedPosts : sortedPosts2;

  const data = isLoading ? Array(5).fill(null) : sortedPosts;

  //   const [posts, setPosts] = useState([]);
  //   const [page, setPage] = useState(1);

  //   const fetchMore = async () => {
  //     const res = await fetch(`/api/posts?page=${page}`);
  //     const newPosts = await res.json();
  //     setPosts(prev => [...prev, ...newPosts]);
  //     setPage(prev => prev + 1);
  //   };

  //   useEffect(() => {
  //     fetchMore(); // Load initial
  //   }, []);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;
    // Compare current scrollTop to previous value to determine direction
    if (scrollTop < lastScrollTop.current) {
      // Scrolling up
      setShowBottomTab(true);
    } else if (scrollTop > lastScrollTop.current) {
      // Scrolling down
      setShowBottomTab(false);
    }
    // setShowBottomTab(scrollTop < 300);
    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
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

  const allowTab = false;
  const allowMSearch = false;

  return (
    <div className="pb-0 lg:pb-0">
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        //style={{height: '950px', width: '100%'}}
        data={data}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <Fragment>
              <MobileNavigation />

              {allowTab && (
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
                        For You
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
              <div className="px-0 py-3 border-b border-app-border lg:hidden md:mt-7">
                <div className="px-4">
                  <h2 className="font-semibold mb-2 mt-0">Discuss</h2>
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
                <div className="px-4 flex flex-wrap gap-2 mb-2 border-t pt-3 border-app-border">
                  {SectionOptions.map(section => (
                    <Badge
                      key={section.id}
                      variant="outline"
                      className="py-1 px-3 cursor-pointer hover:bg-app-hover font-bold border-app-border text-app"
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
                  <div className="relative border-1 border-app-border rounded-full">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray"
                      size={20}
                    />
                    <Input
                      placeholder="Search"
                      className="border-0 rounded-full pl-10 form-input"
                    />
                  </div>
                </div>
              )}
              <div>
                <AppBannerAd section="home" />
              </div>
            </Fragment>
          ),
          EmptyPlaceholder: () => <PostPlaceholder tab={activeTab} />,
        }}
        //endReached={fetchMore}
        // itemContent={(index, post) => <PostCard post={post} />}
        itemContent={(index, post) =>
          isLoading ? (
            <PostSkeleton /> // your loader
          ) : (
            <PostCard post={post} />
          )
        }
      />
      {showGoUp && (
        <button
          onClick={() => {
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
          <ArrowUp size={20} />
        </button>
      )}

      {showBottomTab && <MobileBottomTab />}
    </div>
  );
};

export const ExplorePostList = () => {
  const lastScrollTop = useRef(0);

  const [showBottomTab, setShowBottomTab] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const navigate = useRouter();
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const data = sortedPosts;

  //   const [posts, setPosts] = useState([]);
  //   const [page, setPage] = useState(1);

  //   const fetchMore = async () => {
  //     const res = await fetch(`/api/posts?page=${page}`);
  //     const newPosts = await res.json();
  //     setPosts(prev => [...prev, ...newPosts]);
  //     setPage(prev => prev + 1);
  //   };

  //   useEffect(() => {
  //     fetchMore(); // Load initial
  //   }, []);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;
    // Compare current scrollTop to previous value to determine direction
    if (scrollTop < lastScrollTop.current) {
      // Scrolling up
      setShowBottomTab(true);
    } else if (scrollTop > lastScrollTop.current) {
      // Scrolling down
      setShowBottomTab(false);
    }
    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const onSectionNavigate = (section: string) => {
    if (section === 'Create Ad') {
      navigate.push('/advertise');
      return;
    }
    navigate.push(`/discuss/${section.toLowerCase()}`);
  };
  return (
    <div className="lg:pb-0">
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        //style={{height: '950px', width: '100%'}}
        data={data}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <Fragment>
              <PageHeader title="Search" />
              <div className="p-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray"
                    size={20}
                  />
                  <Input
                    placeholder="Search"
                    className="border-0 rounded-full pl-10 form-input"
                  />
                </div>
              </div>
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
                <AppBannerAd section="home" />
              </div>
              <div className="border-b-2 border-b-app p-3 w-30 mb-3 font-bold text-lg">
                <h1> Trending</h1>
              </div>
            </Fragment>
          ),
          EmptyPlaceholder: () => <Placeholder holder={'explore'} />,
        }}
        //endReached={fetchMore}
        itemContent={(index, post) => <PostCard post={post} />}
      />
      {showGoUp && (
        <button
          onClick={() => {
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
          <ArrowUp size={20} />
        </button>
      )}

      {showBottomTab && <MobileBottomTab />}
    </div>
  );
};

export const BookmarkPostList = () => {
  const lastScrollTop = useRef(0);
  const [showBottomTab, setShowBottomTab] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const navigate = useRouter();
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // Mock bookmarked posts - in a real app, this would come from user data
  const bookmarkedPostIds = ['1', '3']; // Example IDs
  const bookmarkedPosts = Posts.filter(post =>
    bookmarkedPostIds.includes(post.id),
  );

  const data = bookmarkedPosts;

  //   const [posts, setPosts] = useState([]);
  //   const [page, setPage] = useState(1);

  //   const fetchMore = async () => {
  //     const res = await fetch(`/api/posts?page=${page}`);
  //     const newPosts = await res.json();
  //     setPosts(prev => [...prev, ...newPosts]);
  //     setPage(prev => prev + 1);
  //   };

  //   useEffect(() => {
  //     fetchMore(); // Load initial
  //   }, []);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;
    // Compare current scrollTop to previous value to determine direction
    if (scrollTop < lastScrollTop.current) {
      // Scrolling up
      setShowBottomTab(true);
    } else if (scrollTop > lastScrollTop.current) {
      // Scrolling down
      setShowBottomTab(false);
    }
    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const onSectionNavigate = (section: string) => {
    if (section === 'Create Ad') {
      navigate.push('/advertise');
      return;
    }
    navigate.push(`/discuss/${section.toLowerCase()}`);
  };
  return (
    <div className="lg:pb-0">
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        //style={{height: '950px', width: '100%'}}
        data={data}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => <PageHeader title="Bookmarks" />,
          EmptyPlaceholder: () => <Placeholder holder={'bookmark'} />,
        }}
        //endReached={fetchMore}
        itemContent={(index, post) => <PostCard post={post} />}
      />
      {showGoUp && (
        <button
          onClick={() => {
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
          <ArrowUp size={20} />
        </button>
      )}

      {showBottomTab && <MobileBottomTab />}
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
            onClick={() => navigate.push('/explore')}>
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

export const SectionPlaceholder = () => {
  const navigate = useRouter();
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">No posts yet</h2>
      <p className="text-app-gray">Be the first to post in this section!</p>
      <Button
        className="mt-4 bg-app hover:bg-app/90"
        onClick={() => navigate.push('/create')}>
        Create Post
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
      {post => (
        <div>
          <PostCard post={post} />
        </div>
      )}
    </List>
  );
};
