import {Skeleton} from '@/components/ui/skeleton';

const NotificationSkeleton = () => {
  return (
    <div>
      {/* Header */}
      <div className="border-b border-app-border p-4 flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Tabs */}
      <div className="w-full grid grid-cols-2 bg-transparent">
        <Skeleton className="h-12 rounded-none" />
        <Skeleton className="h-12 rounded-none" />
      </div>

      {/* Notifications list */}
      <div className="divide-y divide-app-border">
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className="p-4 hover:bg-app-hover">
            <div className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="flex flex-wrap gap-1 mb-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSkeleton;

export const renderSkeletonNotifications = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <NotificationSkeleton key={i} />
    ))}
  </>
);
