// Simple toast notification service for user notifications
// This creates a global toast notification system

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

class ToastNotificationService {
  private toasts: ToastNotification[] = [];
  private listeners: ((toasts: ToastNotification[]) => void)[] = [];

  // Add a toast notification
  addToast(toast: Omit<ToastNotification, 'id'>): string {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastNotification = {
      id,
      duration: 5000,
      ...toast
    };

    this.toasts.push(newToast);
    this.notifyListeners();

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, newToast.duration);
    }

    return id;
  }

  // Remove a toast
  removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  // Get all toasts
  getToasts(): ToastNotification[] {
    return [...this.toasts];
  }

  // Subscribe to toast changes
  subscribe(listener: (toasts: ToastNotification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  // Convenience methods for different toast types
  success(title: string, message: string, duration?: number): string {
    return this.addToast({ title, message, type: 'success', duration });
  }

  info(title: string, message: string, duration?: number): string {
    return this.addToast({ title, message, type: 'info', duration });
  }

  warning(title: string, message: string, duration?: number): string {
    return this.addToast({ title, message, type: 'warning', duration });
  }

  error(title: string, message: string, duration?: number): string {
    return this.addToast({ title, message, type: 'error', duration });
  }

  // Show project approval notification
  showProjectApproval(projectTitle: string): void {
    this.success(
      '🎉 Project Approved!',
      `Great news! Your project "${projectTitle}" has been approved and is now live on our showcase.`,
      8000
    );
  }

  // Show project rejection notification
  showProjectRejection(projectTitle: string): void {
    this.info(
      '📝 Project Needs Updates',
      `Your project "${projectTitle}" needs some updates before it can be approved. Please review the feedback and resubmit.`,
      8000
    );
  }
}

export const toastNotificationService = new ToastNotificationService();
export type { ToastNotification };