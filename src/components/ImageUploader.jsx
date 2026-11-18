import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { compressImage } from '../utils/format.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/** Multi-image picker. Images are resized in the browser first, so uploads stay small on slow networks. */
export default function ImageUploader({ value = [], onChange, max = 4, label }) {
  const { t } = useLang();
  const toast = useToast();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    const room = max - value.length;
    if (files.length > room) toast.info(t('upload.maxReached', { n: max }));
    setBusy(true);
    const added = [];
    for (const file of files.slice(0, Math.max(room, 0))) {
      if (file.size > 12 * 1024 * 1024) { toast.error(t('upload.tooBig', { name: file.name })); continue; }
      try { added.push(await compressImage(file)); } catch { toast.error(t('upload.notImage', { name: file.name })); }
    }
    setBusy(false);
    if (added.length) onChange([...value, ...added]);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl border-2 border-sandstone-200 bg-white">
            <img src={src} alt={`${label || t('upload.photo')} ${i + 1}`} className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="absolute right-1.5 top-1.5 grid h-10 w-10 place-items-center rounded-full bg-charcoal-900/80 text-ivory hover:bg-charcoal-900" aria-label={t('upload.remove')}>
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" onClick={() => input.current?.click()} disabled={busy} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sandstone-400 bg-sandstone-50 p-2 text-center text-charcoal-700 transition hover:border-terracotta-500 hover:bg-terracotta-50">
            {busy ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImagePlus className="h-8 w-8 text-terracotta-600" aria-hidden />}
            <span className="text-sm font-semibold">{t('upload.add')}</span>
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={handle} />
      <p className="hint">{t('upload.hint', { n: max })}</p>
    </div>
  );
}
