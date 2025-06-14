'use client';
import {usePathname} from 'next/navigation';
import {useState} from 'react';

import {cn} from '@/lib/utils';
import {BookmarkIcon, Home, PenSquare, Search, User} from 'lucide-react';
import Link from 'next/link';

export const MobileBottomTab = () => {
  const location = usePathname();

  const [user] = useState({
    following: ['2'],
    Id: 2,
    displayName: 'Dez',
    username: 'johndoe',
  });
  // Check if we're on a post details page
  const isPostDetail =
    location.includes('/post/') && !location.includes('/reply');

  const isActive = (path: string) => location === path;

  return (
    <div>
      {!isPostDetail && (
        // <div className="fixed bottom-0 left-0 right-0 border-t flex justify-around py-3 z-20 lg:hidden border-app-border">
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-app-border flex justify-around py-3 z-20 lg:hidden">
          <Link
            href="/home"
            className={cn('p-2', isActive('/home') && 'text-app')}>
            <Home size={24} />
          </Link>
          <Link
            href="/explore"
            className={cn('p-2', isActive('/explore') && 'text-app')}>
            <Search size={24} />
          </Link>
          <Link
            href="/create-post"
            className={cn('p-2', isActive('/create-post') && 'text-app')}>
            <PenSquare size={24} />
          </Link>
          <Link
            href="/bookmarks"
            className={cn('p-2', isActive('/bookmarks') && 'text-app')}>
            <BookmarkIcon size={24} />
          </Link>
          <Link
            href={`/profile/${user.username}`}
            className={cn(
              'p-2',
              isActive(`/profile/${user.username}`) && 'text-app',
            )}>
            <User size={24} />
          </Link>
        </div>
      )}
    </div>
  );
};
