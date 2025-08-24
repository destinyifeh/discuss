import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import {AlertTriangle, ArrowLeft, Home, RefreshCw} from 'lucide-react';
import React from 'react';

interface ErrorFeedbackProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showGoBack?: boolean;
  showGoHome?: boolean;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
  retryText?: string;
  goBackText?: string;
  goHomeText?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
  icon?: React.ReactNode;
}

const ErrorFeedback: React.FC<ErrorFeedbackProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again or go back to continue.',
  showRetry = true,
  showGoBack = false,
  showGoHome = false,
  onRetry,
  onGoBack,
  onGoHome,
  retryText = 'Try Again',
  goBackText = 'Go Back',
  goHomeText = 'Go Home',
  className,
  variant = 'default',
  icon,
}) => {
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            {icon || <AlertTriangle className="h-8 w-8 text-destructive" />}
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="flex gap-2 justify-center">
            {showRetry && onRetry && (
              <Button size="sm" onClick={onRetry} variant="outline">
                <RefreshCw className="h-3 w-3 mr-1" />
                {retryText}
              </Button>
            )}
            {showGoBack && (
              <Button size="sm" onClick={handleGoBack} variant="ghost">
                <ArrowLeft className="h-3 w-3 mr-1" />
                {goBackText}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-[400px] p-4',
        className,
      )}>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-3">
                {icon || <AlertTriangle className="h-8 w-8 text-destructive" />}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>

            {/* Message */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              {showRetry && onRetry && (
                <Button onClick={onRetry} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {retryText}
                </Button>
              )}

              <div className="flex gap-2">
                {showGoBack && (
                  <Button
                    onClick={handleGoBack}
                    variant="outline"
                    className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {goBackText}
                  </Button>
                )}

                {showGoHome && (
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="flex-1">
                    <Home className="h-4 w-4 mr-2" />
                    {goHomeText}
                  </Button>
                )}
              </div>
            </div>

            {variant === 'detailed' && (
              <div className="pt-4 border-t">
                <details className="text-left">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-2 bg-muted rounded text-xs font-mono text-muted-foreground">
                    Error occurred at: {new Date().toLocaleString()}
                    <br />
                    User Agent: {navigator.userAgent.slice(0, 50)}...
                  </div>
                </details>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFeedback;
