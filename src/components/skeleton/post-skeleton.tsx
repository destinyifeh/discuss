import {Skeleton} from '@/components/ui/skeleton';

const PostSkeleton = () => {
  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <Skeleton className="w-10 h-10 rounded-full" />

        <div className="flex-1">
          {/* Header skeleton */}
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Image skeleton */}
          <Skeleton className="h-48 w-full mt-3 rounded-xl" />

          {/* Actions skeleton */}
          <div className="flex justify-between mt-3 max-w-md">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;

export const renderSkeletonPosts = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </>
);
