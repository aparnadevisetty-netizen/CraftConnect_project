import { useMemo, useState } from 'react';
import { Search, UsersRound } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { specialties, villages } from '../data/artisans.js';
import ArtisanCard from '../components/ArtisanCard.jsx';
import { PageHeader, EmptyState } from '../components/ui.jsx';

export default function ArtisanDirectory() {
  const { artisans } = useStore();
  const { t, tr, label } = useLang();
  const [q, setQ] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [village, setVillage] = useState('all');

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return artisans.filter((a) => {
      if (specialty !== 'all' && !a.specialties.includes(specialty)) return false;
      if (village !== 'all' && a.village !== village) return false;
      if (needle && ![a.name, a.name_te, a.village, a.bio].join(' ').toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [artisans, q, specialty, village]);

  const used = Array.from(new Set(artisans.map((a) => a.village)));
  const villageOptions = villages.filter((v) => used.includes(v)).concat(used.filter((v) => !villages.includes(v)));

  return (
    <>
      <PageHeader title={t('artisans.title')} subtitle={t('artisans.subtitle')} />
      <div className="container-x py-8">
        <div className="card grid gap-4 p-5 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <label htmlFor="a-q" className="label">{t('search')}</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400" aria-hidden />
              <input id="a-q" type="search" className="input pl-12" placeholder={t('artisans.searchPlaceholder')} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          <div>
            <label htmlFor="a-s" className="label">{t('artisans.specialty')}</label>
            <select id="a-s" className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              <option value="all">{t('all')}</option>
              {specialties.map((s) => <option key={s.key} value={s.key}>{label(specialties, s.key)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="a-v" className="label">{t('field.village')}</label>
            <select id="a-v" className="input" value={village} onChange={(e) => setVillage(e.target.value)}>
              <option value="all">{t('all')}</option>
              {villageOptions.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <p className="mt-6 text-lg font-semibold" aria-live="polite">{t('artisans.count', { n: list.length })}</p>
        <div className="mt-4">
          {list.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((a) => <ArtisanCard key={a.id} artisan={a} />)}</div>
          ) : (
            <EmptyState icon={UsersRound} title={t('artisans.emptyTitle')} text={t('artisans.emptyText')} action={<button className="btn btn-primary" onClick={() => { setQ(''); setSpecialty('all'); setVillage('all'); }}>{t('explore.clearAll')}</button>} />
          )}
        </div>
      </div>
    </>
  );
}
