import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AlertCircleIcon, CheckIcon } from '../components/Icon';

const ToastCtx = createContext({ notify: () => {} });

export const useToast = () => useContext(ToastCtx);

const DISMISS_MS = 3500;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const notify = useCallback((message, tone = 'success') => {
    const id = (nextId.current += 1);
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
      DISMISS_MS,
    );
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {/* Announced politely so it never steals focus from the user's task. */}
      <div className="toastRegion" role="status" aria-live="polite">
        {toasts.map(({ id, message, tone }) => (
          <div key={id} className={`toast toast--${tone}`}>
            {tone === 'error' ? <AlertCircleIcon size={18} /> : <CheckIcon size={18} />}
            <span>{message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
