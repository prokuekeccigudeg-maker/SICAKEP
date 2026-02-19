
import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };

  const colors = {
    success: 'border-emerald-500 text-emerald-700 bg-emerald-50/90',
    error: 'border-red-500 text-red-700 bg-red-50/90',
    info: 'border-blue-500 text-blue-700 bg-blue-50/90',
    warning: 'border-orange-500 text-orange-700 bg-orange-50/90'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[1000] flex items-center gap-3 px-6 py-4 rounded-2xl border-2 shadow-2xl backdrop-blur-md animate-bounce-in ${colors[type]}`}>
      <div className="text-xl">
        <i className={`fas ${icons[type]}`}></i>
      </div>
      <p className="font-bold text-sm tracking-tight">{message}</p>
      <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600">
        <i className="fas fa-times"></i>
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full animate-toast-progress" />
    </div>
  );
};

export default Toast;
