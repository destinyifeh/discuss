'use client';
import {Input} from '@/components/ui/input';

import {PageHeader} from '@/components/app-headers';
import {ExplorePostList} from '@/components/post/post-list';
import {Posts} from '@/constants/data';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {Search} from 'lucide-react';
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
      <PageHeader title="Search" />
      <div className="p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray"
            size={20}
          />
          <Input
            placeholder="Search"
            className={clsx('border-0 rounded-full pl-10 form-input', {
              'bg-gray-100': theme.type === 'default',
              'bg-app-dark-bg/10': theme.type === 'dark',
            })}
          />
        </div>
      </div>

      <ExplorePostList />
    </div>
  );
};
