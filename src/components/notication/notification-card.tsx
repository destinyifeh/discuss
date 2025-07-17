'use client';

import {cn} from '@/lib/utils';
import {NotificationItemProps} from '@/types/user.types';
import {BellIcon} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';

export const NotificationCard = ({
  notification,
}: {
  notification: NotificationItemProps;
}) => {
  return (
    <div
      key={notification._id}
      className={cn(
        'p-4 cursor-pointer hover:bg-app-hover dark:hover:bg-app-dark-bg/10',
        !notification.read ? 'bg-blue-50 dark:bg-app-dark-bg/10' : '',
      )}>
      <div className="flex gap-3">
        <Link href={`/user/${notification.senderName}`}>
          <Avatar>
            <AvatarImage src={notification.senderAvatar} />
            <AvatarFallback>{notification.senderName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex flex-wrap gap-1">
            <Link href={`/user/${notification.senderName}`}>
              <span className="font-bold capitalize">
                {notification.senderName}
              </span>
            </Link>
            <span className="text-app-gray">{notification.content}</span>
          </div>
          <p className="text-xs text-app-gray mt-1">
            {moment(notification.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export const NotificationPlaceholder = ({tab}: {tab: string}) => {
  return (
    <div>
      {tab === 'all' && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <div className="rounded-full p-4 mb-4 hover:bg-app-hover dark:hover:bg-app-dark-bg/10">
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
          <div className="rounded-full p-4 mb-4 hover:bg-app-hover dark:hover:bg-app-dark-bg/10">
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
