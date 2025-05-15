'use client';

import {PostCard} from '@/components/post/post-card';
import {PostList} from '@/components/post/post-list';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Categories, Posts} from '@/constants/data';
import {useVirtualizer} from '@tanstack/react-virtual';
import {useRouter} from 'next/navigation';
import {useRef, useState} from 'react';
export const HomePage = () => {
  const [activeTab, setActiveTab] = useState('for-you');

  const navigate = useRouter();
  const [user] = useState({following: ['2']});
  // Sort posts by timestamp (newest first)
  const sortedPosts = [...Posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // Filter posts for the "Following" tab - only show posts from users the current user is following
  const followingPosts = sortedPosts.filter(
    post => user.following && user.following.includes(post.userId),
  );

  // The scrollable element for your list
  const parentRef = useRef(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div className="">
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

        {/* For You tab content */}
        <TabsContent value="for-you" className="mt-0">
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

          {/* <div className="">
            <AppBannerAd category="home" />
          </div> */}
          {/* 
          {mockAds
            .filter(ad => ad.type === 'Sponsored')
            .map(ad => (
              <div key={ad.id}>
                <AdCard ad={ad} />
              </div>
            ))} */}

          {/* <div>
            <AppSponsoredAd category="home" />
          </div> */}

          {/* {sortedPosts && sortedPosts.length > 0 ? (
            <>
              {sortedPosts.map(post => (
                <div key={post.id}>
                  <PostCard post={post} />
                </div>
              ))}
            </>
          ) : (
            <div className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">No posts yet</h2>
              <p className="text-app-gray">Be the first to post!</p>
            </div>
          )} */}

          <PostList />
        </TabsContent>

        {/* Following tab content */}
        <TabsContent value="following" className="mt-0">
          <div className="px-4 py-3 border-b border-app-border md:hidden">
            <h2 className="font-semibold mb-2">Discuss</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {Categories.map(category => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="py-1 px-3 cursor-pointer hover:bg-app-hover font-bold text-black"
                  onClick={() => navigate.push(`/category/${category.id}`)}>
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {followingPosts && followingPosts.length > 0 ? (
            <>
              {followingPosts.map(post => (
                <div key={post.id}>
                  <PostCard post={post} />
                </div>
              ))}
            </>
          ) : (
            <div className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">
                No posts from your follows
              </h2>
              <p className="text-app-gray mb-4">
                Follow more people to see their posts here!
              </p>
              <button
                className="bg-app hover:bg-app/90 text-white px-5 py-2 rounded-full text-sm font-medium"
                onClick={() => navigate.push('/explore')}>
                Find people to follow
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
