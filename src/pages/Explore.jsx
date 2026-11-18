import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, PackageSearch, Landmark, Columns3, Flower2, Flame, CookingPot, Gift, LayoutGrid } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { categories } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import { PageHeader, EmptyState } from '../components/ui.jsx';

const ICONS = { Landmark, Columns3, Flower2, Flame, CookingPot, Gift };
const PRICE_BANDS = [
  { key: 'any', min: 0, max: Infinity },
  { key: 'u2', min: 0, max: 2000 },
  { key: 'b2', min: 2000, max: 5000 },
  { key: 'b5', min: 5000, max: 15000 },
  { key: 'o15', min: 15000, max: Infinity },
];

export default function Explore() {
  const { products, artisans } = useStore();
  const { t, tr, label } = useLang();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const q = params.get('q') || '';
  const category = params.get('category') || 'all';
  const artisan = params.get('artisan') || 'all';
  const price = params.get('price') || 'any';
  const avail = params.get('avail') || 'all';
  const sort = params.get('sort') || 'new';

  const setParam = (key, value, def) => {
    const next = new URLSearchParams(params);
    if (!value || value === def) next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.key === price) || PRICE_BANDS[0];
    const needle = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (artisan !== 'all' && p.artisanId !== artisan) return false;
      if (p.price < band.min || p.price >= band.max) return false;
      if (avail === 'stock' && p.madeToOrder) return false;
      if (avail === 'order' && !p.madeToOrder) return false;
      if (needle) {
        const a = artisans.find((x) => x.id === p.artisanId);
        const hay = [p.name, p.name_te, p.description, label(categories, p.category), a?.name, a?.village].join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : new Date(b.createdAt) - new Date(a.createdAt)));
    return list;
  }, [products, artisans, q, category, artisan, price, avail, sort, label]);

  const activeCount = [artisan !== 'all', price !== 'any', avail !== 'all'].filter(Boolean).length + (category !== 'all' ? 1 : 0) + (q ? 1 : 0);
  const clearAll = () => setParams({}, { replace: true });

  const select = (id, value, onChange, children, aria) => (
    <select id={id} className="input" value={value} onChange={onChange} aria-label={aria}>{children}</select>
  );

  return (
    <>
      <PageHeader title={t('explore.title')} subtitle={t('explore.subtitle')}>
        <form role="search" onSubmit={(e) => e.preventDefault()} className="relative max-w-2xl">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-charcoal-400" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setParam('q', e.target.value, '')}
            placeholder={t('explore.searchPlaceholder')}
            aria-label={t('search')}
            className="input !min-h-[60px] !rounded-full !border-transparent pl-14 pr-14 text-lg shadow-lift"
          />
          {q && <button type="button" onClick={() => setParam('q', '', '')} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-charcoal-500 hover:bg-sandstone-100" aria-label={t('clear')}><X className="h-5 w-5" /></button>}
        </form>
      </PageHeader>

      <div className="container-x py-8">
        {/* Category chips */}
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label={t('field.category')}>
          <button className={`chip ${category === 'all' ? 'chip-active' : ''}`} onClick={() => setParam('category', 'all', 'all')} aria-pressed={category === 'all'}><LayoutGrid className="h-5 w-5" aria-hidden /> {t('all')}</button>
          {categories.map((c) => {
            const Icon = ICONS[c.icon] || Landmark;
            return (
              <button key={c.key} className={`chip ${category === c.key ? 'chip-active' : ''}`} onClick={() => setParam('category', c.key, 'all')} aria-pressed={category === c.key}>
                <Icon className="h-5 w-5" aria-hidden /> {label(categories, c.key)}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-semibold" aria-live="polite">{t('explore.results', { n: results.length })}</p>
          <div className="flex items-center gap-3">
            {activeCount > 0 && <button onClick={clearAll} className="min-h-[44px] px-2 font-semibold text-terracotta-700 hover:underline">{t('explore.clearAll')}</button>}
            <button onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters} className="btn btn-soft btn-sm"><SlidersHorizontal className="h-5 w-5" aria-hidden /> {t('explore.filters')}{activeCount > 0 && <span className="rounded-full bg-terracotta-600 px-2 text-xs text-ivory">{activeCount}</span>}</button>
          </div>
        </div>

        {showFilters && (
          <div className="card mt-4 grid animate-pop gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="f-artisan" className="label">{t('field.artisan')}</label>
              {select('f-artisan', artisan, (e) => setParam('artisan', e.target.value, 'all'), <>
                <option value="all">{t('explore.allArtisans')}</option>
                {artisans.map((a) => <option key={a.id} value={a.id}>{tr(a, 'name')} ({a.village})</option>)}
              </>)}
            </div>
            <div>
              <label htmlFor="f-price" className="label">{t('field.price')}</label>
              {select('f-price', price, (e) => setParam('price', e.target.value, 'any'), PRICE_BANDS.map((b) => <option key={b.key} value={b.key}>{t(`price.${b.key}`)}</option>))}
            </div>
            <div>
              <label htmlFor="f-avail" className="label">{t('explore.availability')}</label>
              {select('f-avail', avail, (e) => setParam('avail', e.target.value, 'all'), <>
                <option value="all">{t('all')}</option>
                <option value="stock">{t('product.inStock')}</option>
                <option value="order">{t('product.madeToOrder')}</option>
              </>)}
            </div>
            <div>
              <label htmlFor="f-sort" className="label">{t('explore.sort')}</label>
              {select('f-sort', sort, (e) => setParam('sort', e.target.value, 'new'), <>
                <option value="new">{t('sort.new')}</option>
                <option value="low">{t('sort.low')}</option>
                <option value="high">{t('sort.high')}</option>
              </>)}
            </div>
          </div>
        )}

        <div className="mt-8">
          {results.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <EmptyState icon={PackageSearch} title={t('explore.emptyTitle')} text={t('explore.emptyText')} action={<button className="btn btn-primary" onClick={clearAll}>{t('explore.clearAll')}</button>} />
          )}
        </div>
      </div>
    </>
  );
}
