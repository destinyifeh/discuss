import {Skeleton} from '@/components/ui/skeleton';
import {useIsMobile} from '@/hooks/use-mobile';

const FollowersSkeleton = () => {
  const isMobile = useIsMobile();

  return (
    <div>
      <div className="min-h-screen bg-background md:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 bg-background border-b border-border p-3 z-30">
          <div className="flex items-center gap-6">
            <Skeleton className="w-8 h-8 rounded" />
            <div>
              <Skeleton className="h-5 w-20 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16">
          <div className="divide-y divide-border">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className=" min-h-screen bg-background hidden md:block">
        {/* Main Content */}

        {/* Header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-3 flex items-center gap-6">
            <Skeleton className="w-8 h-8 rounded" />
            <div>
              <Skeleton className="h-5 w-20 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Followers List */}
        <div className="divide-y divide-border">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersSkeleton;
