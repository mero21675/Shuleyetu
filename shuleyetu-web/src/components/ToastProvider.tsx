'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

 type ToastVariant = 'info' | 'success' | 'error';

 type Toast = {
  id: number;
  title?: string;
  description?: string;
  variant?: ToastVariant;
};

 type ToastContextValue = {
  showToast: (toast: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const next: Toast = {
      id,
      title: toast.title,
      description: toast.description,
      variant: toast.variant ?? 'info',
    };

    setToasts((previous) => [...previous, next]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((previous) => previous.filter((item) => item.id !== toast.id));
      }, 3500),
    );

    return () => {
      for (const id of timers) {
        window.clearTimeout(id);
      }
    };
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const variant = toast.variant ?? 'info';
          const base =
            'pointer-events-auto rounded-md border px-3 py-2 text-sm shadow-lg backdrop-blur-sm';
          const colors =
            variant === 'success'
              ? 'border-emerald-500/60 bg-emerald-950/90 text-emerald-50'
              : variant === 'error'
              ? 'border-red-500/60 bg-red-950/90 text-red-50'
              : 'border-slate-600 bg-slate-900/90 text-slate-50';

          return (
            <div key={toast.id} className={`${base} ${colors}`}>
              {toast.title && <p className="font-medium">{toast.title}</p>}
              {toast.description && (
                <p className="mt-0.5 text-xs text-slate-200">{toast.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
