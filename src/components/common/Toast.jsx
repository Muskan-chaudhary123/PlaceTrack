import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Clean reusable Toast notification component matching the PlaceTrack design system.
 */
export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      container: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    },
    error: {
      container: 'border-red-200 bg-red-50 text-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />
    },
    info: {
      container: 'border-blue-200 bg-blue-50 text-blue-800',
      icon: <AlertCircle className="h-5 w-5 text-blue-600" />
    }
  }[type] || styles.success;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className={`flex items-center space-x-3 rounded-lg border p-4 shadow-sm min-w-[280px] ${styles.container}`}>
        <div className="shrink-0">{styles.icon}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          onClick={onClose}
          type="button"
          className="rounded p-0.5 text-current hover:bg-black/5 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
