'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastContextValue = { notify: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToolToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const notify = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2200);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[100] max-w-sm rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          {message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToolToast() {
  const ctx = useContext(ToastContext);
  return ctx?.notify ?? (() => {});
}
