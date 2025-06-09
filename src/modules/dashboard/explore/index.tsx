'use client';

import {ExplorePostList} from '@/components/post/post-list';
import {Posts} from '@/constants/data';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {useRouter} from 'next/navigation';

export const ExplorePage = () => {
  const {theme} = useGlobalStore(state => state);
  const navigate = useRouter();

  // Sort posts by popularity (views)
  //const trendingPosts = [...Posts].sort((a, b) => b.views - a.views);
  const trendingPosts = [...Posts].sort(
    (a, b) => (b.views ?? 0) - (a.views ?? 0),
  );
  return (
    <div>
      <ExplorePostList />
    </div>
  );
};
