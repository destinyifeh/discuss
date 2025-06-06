'use client';

import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn, formatTimeAgo} from '@/lib/utils';
import {NotificationItemProps} from '@/types/user.types';
import clsx from 'clsx';
import {BellIcon} from 'lucide-react';
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';

export const NotificationCard = ({
  notification,
}: {
  notification: NotificationItemProps;
}) => {
  const {theme} = useGlobalStore(state => state);
  return (
    <div
      key={notification.id}
      className={cn(
        'p-4 cursor-pointer',
        !notification.read ? 'bg-blue-50' : '',
        theme.type === 'dark' && 'bg-app-dark hover:bg-app-dark-bg/10',
        theme.type === 'default' && 'bg-white hover:bg-app-hover ',
      )}>
      <Link href={notification.postId ? `/post/${notification.postId}` : '#'}>
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={notification.user.avatar} />
            <AvatarFallback>
              {notification.user.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap gap-1">
              <span className="font-bold">{notification.user.displayName}</span>
              <span className="text-app-gray">{notification.content}</span>
            </div>
            <p className="text-xs text-app-gray mt-1">
              {formatTimeAgo(notification.timestamp)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const NotificationPlaceholder = ({tab}: {tab: string}) => {
  const {theme} = useGlobalStore(state => state);
  return (
    <div>
      {tab === 'all' && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <div
            className={clsx('rounded-full p-4 mb-4', {
              'bg-app-dark-bg/10 ': theme.type === 'dark',
              'bg-app-hover   ': theme.type === 'default',
            })}>
            <BellIcon size={32} className="text-app" />
          </div>
          <h2 className="text-xl font-bold mb-2">No notifications yet</h2>
          <p className="text-app-gray mb-4">
            When someone interacts with your posts or follows you, notifications
            will appear here.
          </p>
        </div>
      )}
      {tab === 'mentions' && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <div
            className={clsx('rounded-full p-4 mb-4', {
              'bg-app-dark-bg/10 ': theme.type === 'dark',
              'bg-app-hover   ': theme.type === 'default',
            })}>
            <BellIcon size={32} className="text-app" />
          </div>
          <h2 className="text-xl font-bold mb-2">No mentions yet</h2>
          <p className="text-app-gray mb-4">
            When someone mentions you in a post or comment, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
