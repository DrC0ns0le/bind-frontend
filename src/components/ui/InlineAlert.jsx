import React from 'react';
import { Info, CircleCheck, AlertTriangle, XCircle } from 'lucide-react';

/**
 * Inline Alert component for displaying contextual alerts
 * Different from notifications (toasts) - this is a static inline component
 */
export function Alert({ type = 'info', children, className = '' }) {
  const variants = {
    info: {
      containerClass: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
      iconClass: 'text-blue-600 dark:text-blue-400',
      Icon: Info,
    },
    success: {
      containerClass: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      iconClass: 'text-green-600 dark:text-green-400',
      Icon: CircleCheck,
    },
    warning: {
      containerClass: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      Icon: AlertTriangle,
    },
    error: {
      containerClass: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
      iconClass: 'text-red-600 dark:text-red-400',
      Icon: XCircle,
    },
  };

  const { containerClass, iconClass, Icon } = variants[type] || variants.info;

  return (
    <div className={`border rounded-lg p-4 ${containerClass} ${className}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClass}`} aria-hidden="true" />
        </div>
        <div className="flex-1 text-primary">
          {children}
        </div>
      </div>
    </div>
  );
}
