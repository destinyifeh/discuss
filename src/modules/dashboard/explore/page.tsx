'use client';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';

import {PostCard} from '@/components/post/post-card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Posts, Sections} from '@/constants/data';
import {Search} from 'lucide-react';
import {useRouter} from 'next/navigation';

export const ExplorePage = () => {
  const navigate = useRouter();

  // Sort posts by popularity (views)
  //const trendingPosts = [...Posts].sort((a, b) => b.views - a.views);
  const trendingPosts = [...Posts].sort(
    (a, b) => (b.views ?? 0) - (a.views ?? 0),
  );
  return (
    <div>
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-app-border">
        <div className="p-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray"
              size={20}
            />
            <Input
              placeholder="Search"
              className="bg-gray-100 border-0 rounded-full pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-transparent">
            <TabsTrigger
              value="trending"
              className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
              Trending
            </TabsTrigger>
            {/* <TabsTrigger
              value="news"
              className="data-[state=active]:border-b-2 data-[state=active]:border-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
              News
            </TabsTrigger>
            <TabsTrigger
              value="sports"
              className="data-[state=active]:border-b-2 data-[state=active]:border-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
              Sports
            </TabsTrigger>
            <TabsTrigger
              value="entertainment"
              className="data-[state=active]:border-b-2 data-[state=active]:border-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
              Entertainment
            </TabsTrigger> */}
          </TabsList>

          <div className="py-4">
            <div className="px-4 pb-3 mb-3 border-b border-app-border">
              <h2 className="text-xl font-bold">Discuss</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {Sections.map(section => (
                  <Badge
                    key={section.id}
                    variant="outline"
                    className="py-2 px-4 cursor-pointer hover:bg-app-hover rounded-full font-bold"
                    onClick={() => navigate.push(`/section/${section.id}`)}>
                    {section.name}
                  </Badge>
                ))}
              </div>
            </div>

            <TabsContent value="trending" className="mt-0">
              <div className="divide-y divide-app-border">
                {trendingPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-0">
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">News content</h2>
                <p className="text-app-gray">News posts will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="sports" className="mt-0">
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Sports content</h2>
                <p className="text-app-gray">Sports posts will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="entertainment" className="mt-0">
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">
                  Entertainment content
                </h2>
                <p className="text-app-gray">
                  Entertainment posts will appear here.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
