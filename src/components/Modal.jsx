import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext.jsx';

/** Accessible dialog: closes on Escape / backdrop click, traps scroll, bottom-sheet on phones. */
export default function Modal({ open, onClose, title, children, wide = false, footer }) {
  const { t } = useLang();
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className={`relative flex max-h-[92vh] w-full animate-pop flex-col rounded-t-xl3 bg-ivory shadow-lift outline-none sm:rounded-xl3 ${wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-sandstone-200 px-5 py-4 sm:px-7">
          <h2 className="text-2xl">{title}</h2>
          <button onClick={onClose} className="-mr-2 grid h-12 w-12 shrink-0 place-items-center rounded-full hover:bg-sandstone-100" aria-label={t('close')}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-3 border-t border-sandstone-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">{footer}</div>}
      </div>
    </div>
  );
}
