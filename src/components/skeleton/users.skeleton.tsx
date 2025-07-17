import {Skeleton} from '@/components/ui/skeleton';
import {PageHeader} from '../app-headers';

export const UsersSkeleton = ({
  header = false,
  headerTitle,
  headerDesc,
}: {
  header?: boolean;
  headerTitle?: string;
  headerDesc?: string;
}) => {
  return (
    <div>
      {/* Mobile skeleton */}
      <div className="min-h-screen bg-background md:hidden">
        {/* Mobile Header */}
        {!header && (
          <div className="fixed top-0 left-0 right-0 bg-background border-b border-border p-3 z-30">
            <div className="flex items-center gap-6">
              <Skeleton className="w-8 h-8 rounded" />
              <div>
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        )}

        {header && <PageHeader title={headerTitle} description={headerDesc} />}

        {/* Content */}
        <div className={header ? 'pt-5' : 'pt-16'}>
          <div className="divide-y divide-border">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4 rounded" />
                    </div>
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-3 w-32 mb-1" />
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-full ml-3" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Web view skeleton */}
      <div className="min-h-screen bg-background flex hidden md:block">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl mx-auto border-x border-border">
          {/* Header */}
          {!header && (
            <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
              <div className="px-4 py-3 flex items-center gap-6">
                <Skeleton className="w-8 h-8 rounded" />
                <div>
                  <Skeleton className="h-5 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          )}

          {header && (
            <PageHeader title={headerTitle} description={headerDesc} />
          )}

          {/* Users List */}
          <div className="divide-y divide-border">
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4 rounded" />
                    </div>
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-3 w-40 mb-1" />
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-full ml-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
