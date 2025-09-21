import { useUIStore } from '../store';

export const useToast = () => {
  const { addNotification } = useUIStore();

  const showToast = (title: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', message?: string) => {
    addNotification({
      type,
      title,
      message,
      duration: type === 'error' ? 8000 : type === 'warning' ? 6000 : 5000
    });
  };

  const toast = {
    success: (title: string, message?: string) => {
      showToast(title, 'success', message);
    },
    error: (title: string, message?: string) => {
      showToast(title, 'error', message);
    },
    warning: (title: string, message?: string) => {
      showToast(title, 'warning', message);
    },
    info: (title: string, message?: string) => {
      showToast(title, 'info', message);
    }
  };

  return { toast, showToast };
};