import { useState, useCallback } from 'react';

// Toast hook for managing toast notifications
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      title,
      description,
      variant,
      timestamp: Date.now(),
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);

    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
};

// Export toast function for direct use
export const toast = ({ title, description, variant = 'default' }) => {
  // Simple console log for now - in a real app, you'd use a toast library
  console.log(`Toast: ${title} - ${description} (${variant})`);
  
  // You can integrate with a toast library like react-hot-toast or sonner here
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(`${title}: ${description}`);
  }
};

export default useToast;