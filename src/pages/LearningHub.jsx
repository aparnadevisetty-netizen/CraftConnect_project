import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, PlayCircle, GraduationCap } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { learningCategories } from '../data/learning.js';
import VideoCard from '../components/VideoCard.jsx';
import VideoModal from '../components/VideoModal.jsx';
import { PageHeader, EmptyState } from '../components/ui.jsx';

export default function LearningHub() {
  const { videos, watched } = useStore();
  const { user } = useAuth();
  const { t, tr, label } = useLang();
  const [params, setParams] = useSearchParams();
  const [cat, setCat] = useState('all');
  const [level, setLevel] = useState('all');
  const [q, setQ] = useState('');

  const done = watched[user?.id || 'guest'] || [];
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return videos.filter((v) => (cat === 'all' || v.category === cat) && (level === 'all' || v.level === level) && (!needle || [v.title, v.title_te, v.summary, v.teacher].join(' ').toLowerCase().includes(needle)));
  }, [videos, cat, level, q]);

  const playingId = params.get('v');
  const playing = videos.find((v) => v.id === playingId) || null;
  const open = (v) => setParams({ v: v.id }, { replace: true });
  const close = () => setParams({}, { replace: true });
  const idx = playing ? list.findIndex((v) => v.id === playing.id) : -1;
  const next = idx >= 0 && idx < list.length - 1 ? () => open(list[idx + 1]) : null;
  const pct = videos.length ? Math.round((done.filter((id) => videos.some((v) => v.id === id)).length / videos.length) * 100) : 0;

  return (
    <>
      <PageHeader title={t('learn.title')} subtitle={t('learn.subtitle')}>
        <div className="max-w-md">
          <div className="flex items-center justify-between text-sm text-sandstone-200"><span>{t('learn.progress')}</span><span>{pct}%</span></div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-gold-400 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </PageHeader>

      <div className="container-x py-8">
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label={t('field.category')}>
          <button className={`chip ${cat === 'all' ? 'chip-active' : ''}`} onClick={() => setCat('all')} aria-pressed={cat === 'all'}>{t('all')}</button>
          {learningCategories.map((c) => (
            <button key={c.key} className={`chip ${cat === c.key ? 'chip-active' : ''}`} onClick={() => setCat(c.key)} aria-pressed={cat === c.key}>{label(learningCategories, c.key)}</button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400" aria-hidden />
            <input type="search" className="input pl-12" placeholder={t('learn.searchPlaceholder')} aria-label={t('search')} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input" value={level} onChange={(e) => setLevel(e.target.value)} aria-label={t('learn.level')}>
            <option value="all">{t('learn.allLevels')}</option>
            <option value="beginner">{t('level.beginner')}</option>
            <option value="intermediate">{t('level.intermediate')}</option>
            <option value="advanced">{t('level.advanced')}</option>
          </select>
        </div>

        <p className="mt-6 flex items-center gap-2 text-lg font-semibold" aria-live="polite"><PlayCircle className="h-6 w-6 text-terracotta-600" aria-hidden /> {t('learn.count', { n: list.length })}</p>
        <div className="mt-4">
          {list.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((v) => <VideoCard key={v.id} video={v} watched={done.includes(v.id)} onPlay={open} />)}</div>
          ) : (
            <EmptyState icon={GraduationCap} title={t('learn.emptyTitle')} text={t('learn.emptyText')} action={<button className="btn btn-primary" onClick={() => { setCat('all'); setLevel('all'); setQ(''); }}>{t('explore.clearAll')}</button>} />
          )}
        </div>
      </div>

      <VideoModal video={playing} onClose={close} onNext={next} />
    </>
  );
}
