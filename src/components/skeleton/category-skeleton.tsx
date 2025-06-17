import {Skeleton} from '../ui/skeleton';

const CategorySkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-start gap-6">
          <Skeleton className="w-8 h-8 mt-1" />
          <div className="flex flex-col">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Posts skeleton */}
      <div className="space-y-0">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-border p-4">
            <div className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-6 mt-3">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySkeleton;
