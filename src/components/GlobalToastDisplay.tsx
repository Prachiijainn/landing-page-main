import { useEffect, useState } from 'react';
import { toastNotificationService, type ToastNotification } from '@/services/toastNotificationService';
import { useToast } from '@/components/ui/use-toast';

const GlobalToastDisplay = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to toast notifications
    const unsubscribe = toastNotificationService.subscribe((newToasts) => {
      setToasts(newToasts);
      
      // Show new toasts using the UI toast system
      newToasts.forEach((toastNotification) => {
        // Only show toasts that haven't been shown yet
        const isNewToast = !toasts.find(t => t.id === toastNotification.id);
        if (isNewToast) {
          toast({
            title: toastNotification.title,
            description: toastNotification.message,
            duration: toastNotification.duration || 2000,
            className: getToastClassName(toastNotification.type),
          });
        }
      });
    });

    return unsubscribe;
  }, [toast, toasts]);

  const getToastClassName = (type: ToastNotification['type']): string => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  return null; // This component doesn't render anything visible
};

export default GlobalToastDisplay;