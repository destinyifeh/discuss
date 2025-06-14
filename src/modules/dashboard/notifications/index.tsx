'use client';

import {
  NotificationCard,
  NotificationPlaceholder,
} from '@/components/notication/notification-card';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {notificationData} from '@/constants/data';
import {NotificationItemProps} from '@/types/user.types';
import {ArrowUp} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Fragment, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';

export const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useRouter();
  const [notifications, setNotifications] = useState(notificationData);
  const [showGoUp, setShowGoUp] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({...notification, read: true})),
    );
  };

  const hasUnread = notifications.some(notification => !notification.read);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
  };

  let data: NotificationItemProps[] | [];

  switch (activeTab) {
    case 'all':
      data = notifications;
      break;
    case 'mentions':
      data = [];
      break;
    default:
      data = [];
  }

  return (
    <div>
      <Virtuoso
        className="custom-scrollbar"
        style={{height: '100vh'}}
        data={data}
        onScroll={handleScroll}
        ref={virtuosoRef}
        components={{
          Header: () => (
            <Fragment>
              <div className="border-b p-4 flex justify-between items-center border-app-border">
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
                className="w-full mb-7">
                <TabsList className="w-full grid grid-cols-2 bg-transparent">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="mentions"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-b-app data-[state=active]:rounded-none data-[state=active]:shadow-none py-3">
                    Mentions
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Fragment>
          ),
          EmptyPlaceholder: () => <NotificationPlaceholder tab={activeTab} />,
        }}
        //endReached={fetchMore}
        itemContent={(index, notification) => (
          <NotificationCard notification={notification} />
        )}
      />
      {showGoUp && (
        <button
          onClick={() => {
            virtuosoRef.current?.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="fixedBottomBtn z-1 fixed bottom-6 right-5 lg:right-[calc(50%-24rem)] bg-app text-white p-2 rounded-full shadow-lg hover:bg-app/90 transition">
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};
