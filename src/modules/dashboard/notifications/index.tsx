'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {notificationData} from '@/constants/data';
import {BellIcon} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useRouter();
  const [notifications, setNotifications] = useState(notificationData);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({...notification, read: true})),
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(timestamp).getTime()) / 1000,
    );

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
  };

  const hasUnread = notifications.some(notification => !notification.read);

  return (
    <div>
      <div className="border-b border-app-border p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Notifications</h1>
        {hasUnread && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-transparent">
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
            All
          </TabsTrigger>
          <TabsTrigger
            value="mentions"
            className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:text-black data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
            Mentions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-2">
          {notifications.length > 0 ? (
            <div className="divide-y divide-app-border">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-app-hover cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}>
                  <Link
                    href={
                      notification.postId ? `/post/${notification.postId}` : '#'
                    }>
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>
                          {notification.user.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-1">
                          <span className="font-bold">
                            {notification.user.displayName}
                          </span>
                          <span className="text-app-gray">
                            {notification.content}
                          </span>
                        </div>
                        <p className="text-xs text-app-gray mt-1">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="bg-app-hover rounded-full p-4 mb-4">
                <BellIcon size={32} className="text-app" />
              </div>
              <h2 className="text-xl font-bold mb-2">No notifications yet</h2>
              <p className="text-app-gray mb-4">
                When someone interacts with your posts or follows you,
                notifications will appear here.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="mentions" className="mt-2">
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="bg-app-hover rounded-full p-4 mb-4">
              <BellIcon size={32} className="text-app" />
            </div>
            <h2 className="text-xl font-bold mb-2">No mentions yet</h2>
            <p className="text-app-gray mb-4">
              When someone mentions you in a post or comment, it will appear
              here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
