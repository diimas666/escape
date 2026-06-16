import { showErrorToast } from '../context/ToastContext';
import { resolveErrorMessage } from './errors';

export function reportLoadError(error: unknown, fallback: string): string {
  const message = resolveErrorMessage(error, fallback);
  showErrorToast(error, fallback);
  return message;
}
