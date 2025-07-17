import {Skeleton} from '@/components/ui/skeleton';

const EmailMessageSkeleton = () => {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg border border-app-border p-4">
        <div className="space-y-4">
          {/* To field skeleton */}
          <div>
            <Skeleton className="h-4 w-8 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Subject field skeleton */}
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Message field skeleton */}
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-48 w-full" />
          </div>

          {/* Send button skeleton */}
          <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailMessageSkeleton;
