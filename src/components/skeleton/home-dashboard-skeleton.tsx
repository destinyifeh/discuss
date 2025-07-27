import {Skeleton} from '@/components/ui/skeleton';

export const HomeDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen max-w-3xl mx-auto border-x border-border">
        <div className="md:pt-0 pt-14">
          {/* Mobile header */}
          <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b border-border flex justify-between items-center p-3 z-30">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>

          {/* Sticky header skeleton */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-app-border">
            <div className="w-full grid grid-cols-2 p-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Mobile category section skeleton */}
          <div className="md:hidden px-4 py-3 border-b border-app-border">
            <Skeleton className="h-6 w-16 mb-2" />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>

          {/* Posts skeleton */}
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-app-border p-4">
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                    </div>

                    {i % 3 === 0 && (
                      <Skeleton className="h-48 w-full rounded-xl mt-3" />
                    )}

                    <div className="flex justify-between mt-4 max-w-md">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <Skeleton className="h-5 w-5 rounded" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                      ))}
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile bottom navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around py-3 z-20">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-6 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
