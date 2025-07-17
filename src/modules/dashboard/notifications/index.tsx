'use client';

import {PageHeader} from '@/components/app-headers';
import {FallbackMessage} from '@/components/fallbacks';
import {
  NotificationCard,
  NotificationPlaceholder,
} from '@/components/notication/notification-card';
import NotificationSkeleton from '@/components/skeleton/notification-skeleton';
import {Button} from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {queryClient} from '@/lib/client/query-client';
import {NotificationItemProps} from '@/types/user.types';
import {useMutation, useQuery} from '@tanstack/react-query';
import {ArrowUp} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Fragment, useEffect, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from 'react-virtuoso';
import {
  getNotificationsRequestAction,
  markAllAsReadRequestAction,
} from './actions';

export const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useRouter();

  const [showGoUp, setShowGoUp] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const {
    mutate: markAllAsRead,
    isSuccess,
    isError,
    error: markError,
  } = useMutation({
    mutationFn: markAllAsReadRequestAction,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications']});
      queryClient.invalidateQueries({queryKey: ['unreadCount']});
    },
  });

  const {
    isLoading,
    error,
    data: notificationsData,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotificationsRequestAction(),
    retry: false,
  });
  console.log('query err', error);

  console.log(notificationsData, 'query dataa');

  useEffect(() => {
    if (notificationsData?.some((n: any) => !n.read)) {
      markAllAsRead();
      console.log('mark err', markError, isSuccess);
    }
  }, [notificationsData]);

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  if (error) {
    return (
      <FallbackMessage
        message="Oops! Something went wrong"
        buttonText="Back to Home"
        page="/home"
      />
    );
  }

  let data: NotificationItemProps[] | [];

  switch (activeTab) {
    case 'all':
      data = notificationsData;
      break;
    case 'mentions':
      data = [];
      break;
    default:
      data = [];
  }

  const hasUnread = data.some(notification => !notification.read);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    const scrollTop = event.currentTarget.scrollTop;

    // Show "go up" button if scrolled more than 300px
    setShowGoUp(scrollTop > 300);
  };
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
              <div className=" flex justify-between items-center ">
                <PageHeader title="Notifications" />
                {hasUnread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsRead()}>
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
