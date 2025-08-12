import {cn} from '@/lib/utils';
import {Clock, Loader2, RefreshCw} from 'lucide-react';

interface LoadingFeedbackProps {
  message?: string;
  submessage?: string;
  variant?: 'default' | 'minimal' | 'detailed' | 'page';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  iconType?: 'spinner' | 'clock' | 'refresh';
}

const LoadingFeedback = ({
  message = 'Loading...',
  submessage,
  variant = 'default',
  size = 'md',
  className,
  showIcon = true,
  iconType = 'spinner',
}: LoadingFeedbackProps) => {
  const icons = {
    spinner: Loader2,
    clock: Clock,
    refresh: RefreshCw,
  };

  const Icon = icons[iconType];

  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'w-4 h-4',
      title: 'text-sm',
      subtitle: 'text-xs',
    },
    md: {
      container: 'p-6',
      icon: 'w-6 h-6',
      title: 'text-base',
      subtitle: 'text-sm',
    },
    lg: {
      container: 'p-8',
      icon: 'w-8 h-8',
      title: 'text-lg',
      subtitle: 'text-base',
    },
  };

  const variantClasses = {
    default: 'bg-background border border-border rounded-lg',
    minimal: 'bg-transparent',
    detailed: 'bg-card border border-border rounded-xl shadow-sm',
    page: 'min-h-[50vh] bg-background',
  };

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          sizeClasses[size].container,
          className,
        )}>
        <div className="flex items-center gap-3">
          {showIcon && (
            <Icon
              className={cn(
                sizeClasses[size].icon,
                'text-primary animate-spin',
              )}
            />
          )}
          <span
            className={cn(
              sizeClasses[size].title,
              'text-foreground font-medium',
            )}>
            {message}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          variantClasses[variant],
          className,
        )}>
        <div className="text-center space-y-4 max-w-md">
          {showIcon && (
            <div className="flex justify-center">
              <div className="relative">
                <Icon
                  className={cn(
                    sizeClasses[size].icon,
                    'text-primary animate-spin',
                  )}
                />
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <h3
              className={cn(
                sizeClasses[size].title,
                'font-semibold text-foreground',
              )}>
              {message}
            </h3>
            {submessage && (
              <p
                className={cn(
                  sizeClasses[size].subtitle,
                  'text-muted-foreground',
                )}>
                {submessage}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        variantClasses[variant],
        sizeClasses[size].container,
        className,
      )}>
      <div className="text-center space-y-3">
        {showIcon && (
          <div className="flex justify-center">
            <Icon
              className={cn(
                sizeClasses[size].icon,
                'text-primary animate-spin',
              )}
            />
          </div>
        )}
        <div className="space-y-1">
          <h3
            className={cn(
              sizeClasses[size].title,
              'font-medium text-foreground',
            )}>
            {message}
          </h3>
          {submessage && (
            <p
              className={cn(
                sizeClasses[size].subtitle,
                'text-muted-foreground',
              )}>
              {submessage}
            </p>
          )}
        </div>
        {variant === 'detailed' && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export {LoadingFeedback};
