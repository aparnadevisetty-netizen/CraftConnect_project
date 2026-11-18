import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

const STYLES = {
  success: { icon: CheckCircle2, cls: 'border-olive-500 bg-olive-50 text-olive-900' },
  error: { icon: AlertCircle, cls: 'border-red-500 bg-red-50 text-red-900' },
  info: { icon: Info, cls: 'border-gold-500 bg-sandstone-50 text-charcoal-900' },
};

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), []);
  const push = useCallback(
    (kind, message) => {
      const id = Math.random().toString(36).slice(2);
      setItems((list) => [...list.slice(-2), { id, kind, message }]);
      setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 4500);
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({ success: (m) => push('success', m), error: (m) => push('error', m), info: (m) => push('info', m) }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite" role="status">
        {items.map((t) => {
          const { icon: Icon, cls } = STYLES[t.kind];
          return (
            <div key={t.id} className={`pointer-events-auto flex w-full max-w-md animate-pop items-start gap-3 rounded-xl2 border-l-4 p-4 shadow-lift ${cls}`}>
              <Icon className="mt-0.5 h-6 w-6 shrink-0" aria-hidden />
              <p className="flex-1 text-base font-medium">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="-m-2 grid h-11 w-11 place-items-center rounded-full hover:bg-black/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
