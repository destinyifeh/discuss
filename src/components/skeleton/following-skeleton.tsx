import {Skeleton} from '@/components/ui/skeleton';
import {useIsMobile} from '@/hooks/use-mobile';

const FollowingSkeleton = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
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
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border p-4">
        <div className="space-y-4">
          <div className="p-2 flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="w-6 h-6 rounded" />
          </div>

          <nav className="space-y-2">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </nav>

          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2 p-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-3xl mx-auto border-x border-border">
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

        {/* Following List */}
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

      {/* Right Sidebar */}
      <div className="w-80 hidden lg:block p-4">
        <div className="sticky top-4 space-y-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <Skeleton className="h-6 w-16 mb-4" />
            <div className="space-y-3">
              {Array.from({length: 5}).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center mb-4">
              <Skeleton className="w-5 h-5 mr-2" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-3">
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowingSkeleton;
