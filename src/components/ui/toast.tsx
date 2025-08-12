import {AlertCircle, AlertTriangle, CheckCircle, Info} from 'lucide-react';
import {useTheme} from 'next-themes';
import {Toaster as Sonner, toast} from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({...props}: ToasterProps) => {
  const {theme = 'system'} = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success:
            'group-[.toaster]:border-green-200 group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 dark:group-[.toaster]:border-green-800 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:text-green-200',
          error:
            'group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50 group-[.toaster]:text-red-800 dark:group-[.toaster]:border-red-800 dark:group-[.toaster]:bg-red-950 dark:group-[.toaster]:text-red-200',
          warning:
            'group-[.toaster]:border-yellow-200 group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-800 dark:group-[.toaster]:border-yellow-800 dark:group-[.toaster]:bg-yellow-950 dark:group-[.toaster]:text-yellow-200',
          info: 'group-[.toaster]:border-blue-200 group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-800 dark:group-[.toaster]:border-blue-800 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-200',
        },
      }}
      {...props}
    />
  );
};

// Enhanced toast methods with icons
const enhancedToast = {
  ...toast,
  success: (message: string, options?: any) => {
    return toast.success(message, {
      icon: (
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      ),
      className:
        'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
      ...options,
    });
  },
  error: (message: string, options?: any) => {
    return toast.error(message, {
      icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      className:
        'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
      ...options,
    });
  },
  warning: (message: string, options?: any) => {
    return toast(message, {
      icon: (
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      ),
      className:
        'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
      ...options,
    });
  },
  info: (message: string, options?: any) => {
    return toast(message, {
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      className:
        'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
      ...options,
    });
  },
};

export {enhancedToast as toast, Toaster};
