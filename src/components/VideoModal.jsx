import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronRight, VideoOff } from 'lucide-react';
import Modal from './Modal.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/** Plays one lesson. preload="metadata" keeps data use low until the learner presses play. */
export default function VideoModal({ video, onClose, onNext }) {
  const { t, tr } = useLang();
  const { user } = useAuth();
  const { watched, markWatched } = useStore();
  const toast = useToast();
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  const userKey = user?.id || 'guest';
  const done = video && (watched[userKey] || []).includes(video.id);

  useEffect(() => { setFailed(false); }, [video]);
  if (!video) return null;

  const translated = tr(video, 'steps');
  const stepList = Array.isArray(translated) && translated.length ? translated : video.steps || [];

  const mark = () => {
    markWatched(userKey, video.id);
    toast.success(t('toast.lessonDone'));
  };

  return (
    <Modal open={!!video} onClose={onClose} wide title={tr(video, 'title')}>
      <div className="overflow-hidden rounded-xl2 bg-charcoal-900">
        {failed ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 p-6 text-center text-sandstone-200">
            <VideoOff className="h-10 w-10" aria-hidden />
            <p className="max-w-sm">{t('learn.videoFailed')}</p>
            <button className="btn btn-soft btn-sm" onClick={() => { setFailed(false); ref.current?.load(); }}>{t('tryAgain')}</button>
          </div>
        ) : (
          <video
            ref={ref}
            key={video.id}
            className="aspect-video w-full"
            controls
            playsInline
            preload="metadata"
            onEnded={() => !done && mark()}
            onError={() => setFailed(true)}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        )}
      </div>
      {import.meta.env.DEV && <p className="mt-2 text-xs text-charcoal-400">Dev note: demo clip. Replace `src` in src/data/learning.js with your own tutorial.</p>}
      <p className="mt-4 text-sm text-charcoal-500">{t('learn.by', { name: video.teacher })} · {t('learn.minutes', { n: video.minutes })}</p>
      <p className="mt-2 text-lg">{tr(video, 'summary')}</p>
      <h3 className="mt-5 text-xl">{t('learn.keySteps')}</h3>
      <ol className="mt-3 space-y-2">
        {stepList.map((s, i) => (
          <li key={i} className="flex gap-3 rounded-xl bg-white p-3.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-terracotta-100 font-semibold text-terracotta-800">{i + 1}</span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button className={`btn ${done ? 'btn-soft' : 'btn-olive'}`} onClick={mark} disabled={done}>
          <CheckCircle2 className="h-5 w-5" aria-hidden /> {done ? t('learn.watched') : t('learn.markDone')}
        </button>
        {onNext && <button className="btn btn-soft" onClick={onNext}>{t('learn.next')} <ChevronRight className="h-5 w-5" aria-hidden /></button>}
      </div>
    </Modal>
  );
}
