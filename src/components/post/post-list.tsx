'use client';
import {Categories, mockAds, Posts} from '@/constants/data';
import {useVirtualizer} from '@tanstack/react-virtual';
import {Fragment, useMemo, useRef, useState} from 'react';
//import {VariableSizeList as List} from 'react-window';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {
  insertAdsAtRandomPositions,
  mergePostsWithAds,
  shuffleArray,
} from '@/lib/helpers';
import {AdProps} from '@/types/ad-types';
import {PostProps} from '@/types/post-item.type';
import {ArrowUp} from 'lucide-react';
import {useRouter} from 'next/navigation';
import List from 'rc-virtual-list';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {AdCard} from '../ad/ad-card';
import {AppBannerAd} from '../ad/banner';
import {Badge} from '../ui/badge';
import {Tabs, TabsList, TabsTrigger} from '../ui/tabs';
import {PostCard} from './post-card';

export const PostList45 = () => {
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // The scrollable element for your list
  //const parentRef = useRef(null);

  // The virtualizer
  //   const rowVirtualizer = useVirtualizer({
  //     count: 10000,
  //     getScrollElement: () => parentRef.current,
  //     estimateSize: () => 35,
  //   });

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedPosts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // adjust if your card is taller or shorter
  });

  return (
    <>
      {/* The scrollable element for your list */}
      {sortedPosts.length > 0 ? (
        <div
          ref={parentRef}
          style={{
            height: `800px`,
            overflow: 'auto', // Make it scroll!
          }}>
          {/* The large inner element to hold all of the items */}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}>
            {/* Only the visible items in the virtualizer, manually positioned to be in view */}
            {rowVirtualizer.getVirtualItems().map(virtualItem => {
              const post = sortedPosts[virtualItem.index];

              console.log(post, 'myyyous');

              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}>
                  <PostCard post={post} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No posts yet</h2>
          <p className="text-app-gray">Be the first to post!</p>
        </div>
      )}
    </>
  );
};

type MergedItem = {type: 'post'; data: PostProps} | {type: 'ad'; data: AdProps};
export const CategoryPostList = ({
  adCategory,
  bannerAd,
}: {
  adCategory: string;
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
    ad => ad.type === 'Sponsored' && ad.category === adCategory,
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
    if (scrollTop > lastScrollTop.current + 5) {
      setTimeout(() => {
        setShowBottomTab(false);
      }, 500);
    } else if (scrollTop < lastScrollTop.current - 5) {
      setShowBottomTab(true);
    }

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
          ad => ad.type === 'Sponsored' && ad.category === adCategory,
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
    }, [Posts, mockAds, adCategory]);
  }

  const mergedPosts = useMemo(() => {
    const sortedPosts = [...Posts].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const sponsoredAds = mockAds.filter(
      ad => ad.type === 'Sponsored' && ad.category === adCategory,
    );

    return insertAdsAtRandomPositions(sortedPosts, sponsoredAds);
  }, [Posts, mockAds, adCategory]);

  const mergedItems = useMemo(() => {
    return mergePostsWithAds(sortedPosts, shuffleArray(sponsoredAd));
  }, [Posts, mockAds, adCategory]);

  return (
    <div>
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        //style={{height: '950px', width: '100%'}}

        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <div>
              <AppBannerAd category={bannerAd} />
            </div>
          ),
          EmptyPlaceholder: () => <PostPlaceholder tab={activeTab} />,
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

// export const PostList6 = () => {
//   const sortedPosts = [...Posts].sort(
//     (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
//   );

//   const ITEM_HEIGHT = 380; // Assume all PostCards are 180px tall

//   // Function that returns the height of each item
//   const getItemSize = () => ITEM_HEIGHT;

//   // Row renderer
//   const Row = ({index, style}: {index: number; style: React.CSSProperties}) => {
//     const post = sortedPosts[index];
//     return (
//       <div
//         style={{
//           ...style,
//           boxSizing: 'border-box',
//           padding: '12px',
//         }}>
//         <PostCard post={post} />
//       </div>
//     );
//   };

//   return (
//     <List
//       height={800} // height of visible area
//       itemCount={sortedPosts.length}
//       itemSize={getItemSize}
//       width="100%">
//       {Row}
//     </List>
//   );
// };

export const HomePostList = () => {
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
    if (scrollTop > lastScrollTop.current + 5) {
      setTimeout(() => {
        setShowBottomTab(false);
      }, 500);
    } else if (scrollTop < lastScrollTop.current - 5) {
      setShowBottomTab(true);
    }

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  };

  const handleScrolling = (scrollTop: number) => {
    setShowGoUp(scrollTop > 300);
  };

  const handleGoToTop = () => {
    scrollRef.current?.scrollTo({top: 0});
  };
  return (
    <div>
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
              <Tabs
                defaultValue="for-you"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full">
                <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                  <TabsList className="w-full grid grid-cols-2 border-b border-app-border rounded-none bg-white">
                    <TabsTrigger
                      value="for-you"
                      className="data-[state=active]:font-bold rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:shadow-none px-6 py-3">
                      For You
                    </TabsTrigger>
                    <TabsTrigger
                      value="following"
                      className="data-[state=active]:font-bold rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:shadow-none px-6 py-3">
                      Following
                    </TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>

              <div className="px-4 py-3 border-b border-app-border md:hidden">
                <h2 className="font-semibold mb-2 text-black">Discuss</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Categories.map(category => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="py-1 px-3 cursor-pointer hover:bg-app-hover font-bold text-black"
                      onClick={() =>
                        navigate.push(`/discuss/${category.name.toLowerCase()}`)
                      }>
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <AppBannerAd category="home" />
              </div>
            </Fragment>
          ),
          EmptyPlaceholder: () => <PostPlaceholder tab={activeTab} />,
        }}
        //endReached={fetchMore}
        itemContent={(index, post) => (
          <div>
            <PostCard post={post} />
          </div>
        )}
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
