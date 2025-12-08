'use client';

import { useEffect } from 'react';

interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'danger' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ show, message, type = 'info', duration = 1500, onClose }: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const className = `alert alert-${type} position-fixed top-0 end-0 m-3 shadow`;

  return (
    <div className={className} role="alert" style={{ zIndex: 2000 }}>
      {message}
    </div>
  );
}
