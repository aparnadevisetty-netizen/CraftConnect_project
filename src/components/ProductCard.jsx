import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import SmartImage from './SmartImage.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { formatPrice } from '../utils/format.js';
import { categories } from '../data/products.js';

export default function ProductCard({ product }) {
  const { getArtisan } = useStore();
  const { t, tr, label } = useLang();
  const artisan = getArtisan(product.artisanId);
  const photo = product.photos?.[0];
  return (
    <article className="group card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/crafts/${product.id}`} className="block" aria-label={tr(product, 'name')}>
        <div className="aspect-[4/3] overflow-hidden bg-sandstone-100">
          <div className="h-full w-full transition duration-500 group-hover:scale-[1.04]">
            <SmartImage photo={photo} art={product.art} tone={product.tone} alt={tr(product, 'name')} />
          </div>
        </div>
      </Link>
      <div className="p-5">
        <p className="text-sm font-medium text-olive-700">{label(categories, product.category)}</p>
        <h3 className="mt-1 text-xl leading-snug"><Link to={`/crafts/${product.id}`} className="hover:text-terracotta-700">{tr(product, 'name')}</Link></h3>
        {artisan && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-charcoal-600">
            <MapPin className="h-4 w-4 shrink-0 text-terracotta-600" aria-hidden />
            <Link to={`/artisans/${artisan.id}`} className="truncate hover:underline">{tr(artisan, 'name')}, {artisan.village}</Link>
          </p>
        )}
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="font-display text-2xl font-semibold text-charcoal-900">{formatPrice(product.price)}</p>
          <span className={`badge ${product.madeToOrder ? 'bg-sandstone-200 text-sandstone-900' : 'bg-olive-100 text-olive-800'}`}>
            {product.madeToOrder && <Clock className="h-3.5 w-3.5" aria-hidden />}
            {product.madeToOrder ? t('product.madeToOrder') : t('product.inStock')}
          </span>
        </div>
      </div>
    </article>
  );
}
