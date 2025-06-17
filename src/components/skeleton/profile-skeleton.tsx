import {Skeleton} from '@/components/ui/skeleton';

const ProfileSkeleton = () => {
  return (
    <div>
      {/* Header with back button */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-app-border">
        <div className="px-4 py-3 flex items-center gap-6">
          <Skeleton className="w-8 h-8 rounded" />
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      {/* Cover photo area */}
      <div className="border-b border-app-border">
        <Skeleton className="h-40 w-full" />

        <div className="px-4 pb-4">
          <div className="flex justify-between relative">
            {/* Profile picture */}
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white absolute -top-12">
              <Skeleton className="w-full h-full rounded-full" />
            </div>

            <div className="flex-1"></div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>

          {/* Profile info */}
          <div className="mt-16">
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-24 mb-3" />

            {/* Location, website, join date */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Following/Followers */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full grid grid-cols-3 bg-transparent border-b border-app-border">
        <Skeleton className="h-12 rounded-none" />
        <Skeleton className="h-12 rounded-none" />
        <Skeleton className="h-12 rounded-none" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
