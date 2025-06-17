import {Skeleton} from '@/components/ui/skeleton';

const CommentSkeleton = () => {
  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <Skeleton className="w-10 h-10 rounded-full" />

        <div className="flex-1">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-6 w-6" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Actions skeleton */}
          <div className="flex gap-6 mt-3">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
