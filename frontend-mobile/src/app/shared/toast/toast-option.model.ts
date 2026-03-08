export interface ToastOption {
  message: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
  duration?: number; // milliseconds
}
