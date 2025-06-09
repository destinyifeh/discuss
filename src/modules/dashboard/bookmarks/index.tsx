'use client';
import {PageHeader} from '@/components/app-headers';
import {PostCard} from '@/components/post/post-card';
import {Posts} from '@/constants/data';
import {useGlobalStore} from '@/hooks/stores/use-global-store';

import {BookmarkIcon} from 'lucide-react';
import {useRouter} from 'next/navigation';

export const BookmarksPage = () => {
  const navigate = useRouter();
  const {theme} = useGlobalStore(state => state);

  // Mock bookmarked posts - in a real app, this would come from user data
  const bookmarkedPostIds = ['1', '3']; // Example IDs
  const bookmarkedPosts = Posts.filter(post =>
    bookmarkedPostIds.includes(post.id),
  );

  return (
    <div>
      {/* <div
        className={clsx('border-b p-4', {
          'border-app-border': theme.type === 'default',
          'border-app-dark-border': theme.type === 'dark',
        })}>
        <h1 className="text-xl font-bold">Bookmarks</h1>
      </div> */}

      <PageHeader title="Bookmarks" />

      {bookmarkedPosts.length > 0 ? (
        <div className="divide-y divide-app-border">
          {bookmarkedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 text-center">
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
