import { Link } from 'react-router-dom';
import { MapPin, Award, ArrowRight } from 'lucide-react';
import { Avatar } from './ui.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { specialties } from '../data/artisans.js';

export default function ArtisanCard({ artisan }) {
  const { products } = useStore();
  const { t, tr, label } = useLang();
  const count = products.filter((p) => p.artisanId === artisan.id).length;
  return (
    <article className="card flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-center gap-4">
        <Avatar name={artisan.name} size="lg" tone={artisan.tone === 'sage' ? 'olive' : artisan.tone === 'slate' ? 'charcoal' : 'terracotta'} photo={artisan.photo} />
        <div className="min-w-0">
          <h3 className="text-xl leading-snug">{tr(artisan, 'name')}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-charcoal-600"><MapPin className="h-4 w-4 shrink-0 text-terracotta-600" aria-hidden /> {artisan.village}, {t('palnadu')}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-charcoal-600"><Award className="h-4 w-4 shrink-0 text-gold-600" aria-hidden /> {t('artisan.years', { n: artisan.experience })}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-[15px] text-charcoal-600">{tr(artisan, 'bio') || t('artisan.noBio')}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {artisan.specialties.map((s) => <span key={s} className="badge bg-sandstone-100 text-sandstone-900">{label(specialties, s)}</span>)}
      </div>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-sm font-medium text-charcoal-600">{t('artisan.crafts', { n: count })}</span>
        <Link to={`/artisans/${artisan.id}`} className="btn btn-soft btn-sm">{t('viewProfile')} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </article>
  );
}
