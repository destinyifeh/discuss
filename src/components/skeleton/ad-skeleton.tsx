import {Skeleton} from '@/components/ui/skeleton';

const AdSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Pending Advertisements Header */}
      {/* <Skeleton className="h-7 w-48" /> */}

      {/* Ad Cards */}
      {Array.from({length: 3}).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              {/* Title */}
              <Skeleton className="h-6 w-64 mb-2" />

              {/* Description */}
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-3" />

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Sponsor info */}
              <Skeleton className="h-3 w-48 mb-2" />

              {/* Preview button */}
              <Skeleton className="h-8 w-24 mt-2" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}

      {/* Active Advertisements Header */}
      <Skeleton className="h-7 w-44 mt-8" />

      {/* Active ads placeholder */}
      <div className="border rounded-lg p-6 text-center">
        <Skeleton className="h-4 w-56 mx-auto" />
      </div>
    </div>
  );
};

export default AdSkeleton;
