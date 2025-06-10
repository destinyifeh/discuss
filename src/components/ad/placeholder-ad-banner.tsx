import {Button} from '@/components/ui/button';
import {PlusCircle} from 'lucide-react';
import React from 'react';

interface PlaceholderAdBannerProps {
  onClick?: () => void;
  className?: string;
}

const PlaceholderAdBanner: React.FC<PlaceholderAdBannerProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`h-[120px] w-full relative overflow-hidden rounded-lg border border-forum-border bg-forum-hover hover:bg-gray-50 transition-colors duration-200 ${className}`}>
      {/* Main Content */}
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <PlusCircle className="text-forum-gray" size={20} />
            <h3 className="text-lg font-medium text-forum-gray">
              Your ad could be here
            </h3>
          </div>

          <p className="text-sm text-forum-gray/70">
            Reach engaged users with your message
          </p>

          {onClick && (
            <Button
              onClick={onClick}
              variant="outline"
              size="sm"
              className="mt-2 text-forum-blue border-forum-blue hover:bg-forum-blue hover:text-white">
              Learn more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceholderAdBanner;
