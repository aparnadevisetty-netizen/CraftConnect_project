import { Play, Clock, CheckCircle2 } from 'lucide-react';
import StoneArt from './StoneArt.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { learningCategories } from '../data/learning.js';

export default function VideoCard({ video, watched, onPlay }) {
  const { t, tr, label } = useLang();
  return (
    <article className="group card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <button onClick={() => onPlay(video)} className="relative block aspect-video w-full overflow-hidden bg-sandstone-100 text-left" aria-label={`${t('learn.play')}: ${tr(video, 'title')}`}>
        <StoneArt art={video.art} tone={video.tone} title="" className="transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 grid place-items-center bg-charcoal-900/10 transition group-hover:bg-charcoal-900/25">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-ivory/95 text-terracotta-700 shadow-lift transition group-hover:scale-110"><Play className="h-7 w-7 translate-x-0.5" fill="currentColor" aria-hidden /></span>
        </span>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-charcoal-900/85 px-2.5 py-1 text-xs font-semibold text-ivory"><Clock className="h-3.5 w-3.5" aria-hidden /> {t('learn.minutes', { n: video.minutes })}</span>
        {watched && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-olive-600 px-2.5 py-1 text-xs font-semibold text-ivory"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> {t('learn.watched')}</span>}
      </button>
      <div className="p-5">
        <p className="text-sm font-medium text-olive-700">{label(learningCategories, video.category)} · {t(`level.${video.level}`)}</p>
        <h3 className="mt-1 text-xl leading-snug">{tr(video, 'title')}</h3>
        <p className="mt-2 line-clamp-2 text-[15px] text-charcoal-600">{tr(video, 'summary')}</p>
        <p className="mt-3 text-sm text-charcoal-500">{t('learn.by', { name: video.teacher })}</p>
      </div>
    </article>
  );
}
