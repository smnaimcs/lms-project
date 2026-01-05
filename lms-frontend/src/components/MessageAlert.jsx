// src/components/MessageAlert.jsx
import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const MessageAlert = ({ message, type, onClose }) => {
  if (!message) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-400',
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case 'success':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-400',
          icon: <CheckCircle className="w-5 h-5" />,
        };
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-400',
          icon: <Info className="w-5 h-5" />,
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`${styles.bg} ${styles.text} border ${styles.border} rounded-lg p-4 mb-4 flex items-start justify-between`}>
      <div className="flex items-start gap-3">
        {styles.icon}
        <p className="flex-1">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 hover:opacity-70 transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default MessageAlert;
