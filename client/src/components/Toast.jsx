import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function Toast({ message, type = 'success', onClose, duration = 2000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: faCheckCircle,
          iconColor: 'text-green-500',
          textColor: 'text-green-800'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: faTimesCircle,
          iconColor: 'text-red-500',
          textColor: 'text-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: faExclamationCircle,
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-800'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: faInfoCircle,
          iconColor: 'text-blue-500',
          textColor: 'text-blue-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: faInfoCircle,
          iconColor: 'text-gray-500',
          textColor: 'text-gray-800'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slideDown">
      <div className={`${styles.bg} ${styles.border} border rounded-xl shadow-2xl p-4 min-w-[300px] max-w-md`}>
        <div className="flex items-center gap-3">
          <FontAwesomeIcon 
            icon={styles.icon} 
            className={`${styles.iconColor} text-xl`}
          />
          <p className={`${styles.textColor} font-medium flex-1`}>
            {message}
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
