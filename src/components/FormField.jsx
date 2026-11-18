import { AlertCircle } from 'lucide-react';

/** Label + control + hint + error. `children` is the control; pass `id` so the label is linked. */
export default function FormField({ id, label, hint, error, optional, optionalLabel = 'optional', children }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label} {optional && <span className="font-normal text-charcoal-400">({optionalLabel})</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="hint">{hint}</p>}
      {error && (
        <p className="error-text" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}
