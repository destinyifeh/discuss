import {Skeleton} from '@/components/ui/skeleton';

const CreatePostSkeleton = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-forum-border z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:gap-4">
          {/* Avatar */}
          <Skeleton className="h-10 w-10 md:h-12 md:w-12 mb-4 md:mb-0 rounded-full" />

          <div className="flex-1">
            {/* Content textarea */}
            <Skeleton className="h-20 w-full rounded-md" />

            {/* Image previews skeleton */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg" />
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg" />
            </div>

            {/* Video URL skeleton */}
            <div className="mt-3 space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Bottom actions */}
            <div className="border-t border-forum-border mt-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex space-x-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-8 w-36 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </div>

            {/* Community guidelines skeleton */}
            <div className="mt-4">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostSkeleton;
