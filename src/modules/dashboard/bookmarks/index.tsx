'use client';
import {BookmarkPostList} from '@/components/post/post-list';
import {useGlobalStore} from '@/hooks/stores/use-global-store';

import {useRouter} from 'next/navigation';

export const BookmarksPage = () => {
  const navigate = useRouter();
  const {theme} = useGlobalStore(state => state);

  return (
    <div>
      <BookmarkPostList />
    </div>
  );
};
