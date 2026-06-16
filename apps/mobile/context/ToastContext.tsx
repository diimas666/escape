import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Toast } from '../components/Toast';
import { resolveErrorMessage } from '../utils/errors';

export type ToastType = 'error' | 'info' | 'success';

export type ToastPayload = {
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 3200;

let globalShowToast: ((message: string, type?: ToastType) => void) | null = null;

export function showToast(message: string, type: ToastType = 'info') {
  globalShowToast?.(message, type);
}

export function showErrorToast(error: unknown, fallback: string) {
  showToast(resolveErrorMessage(error, fallback), 'error');
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToastHandler = useCallback((message: string, type: ToastType = 'info') => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setToast({ message, type });

    hideTimerRef.current = setTimeout(() => {
      setToast(null);
      hideTimerRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => {
    globalShowToast = showToastHandler;

    return () => {
      globalShowToast = null;
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [showToastHandler]);

  const value = useMemo(
    () => ({
      showToast: showToastHandler,
    }),
    [showToastHandler],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toast={toast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
