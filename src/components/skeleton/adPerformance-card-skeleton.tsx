import {Skeleton} from '@/components/ui/skeleton';

const AdPerformanceCardSkeleton = () => {
  return (
    <div>
      <div className="p-4">
        {/* Ad cards grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              {/* Card header */}
              <div className="p-4 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-full mb-2" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>

              {/* Card content */}
              <div className="px-4 pb-4">
                {/* Type/Plan/Category grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {Array.from({length: 3}).map((_, j) => (
                    <div key={j} className="p-2 bg-gray-50 rounded-lg">
                      <Skeleton className="h-3 w-8 mb-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>

                {/* Ad image placeholder */}
                <Skeleton className="h-32 w-full rounded-lg mb-3" />

                {/* Performance metrics */}
                <div className="space-y-2 mb-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>

                {/* Bottom section */}
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-8 mb-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdPerformanceCardSkeleton;
