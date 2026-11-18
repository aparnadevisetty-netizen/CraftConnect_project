import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Send, MessageCircle, Phone, Hammer, Share2, Ruler, Weight, Gem, Clock, MapPin, PackageSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { categories } from '../data/products.js';
import SmartImage from '../components/SmartImage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import { Avatar, BackLink, EmptyState } from '../components/ui.jsx';
import { formatPrice, cleanPhone, whatsappLink } from '../utils/format.js';

export default function ProductDetails() {
  const { id } = useParams();
  const { getProduct, getArtisan, products } = useStore();
  const { role, user } = useAuth();
  const { t, tr, label } = useLang();
  const toast = useToast();
  const [active, setActive] = useState(0);
  const [enquiry, setEnquiry] = useState(false);

  const product = getProduct(id);
  const artisan = product && getArtisan(product.artisanId);

  const views = useMemo(() => {
    if (!product) return [];
    if (product.photos?.length) return product.photos.map((photo, i) => ({ key: `p${i}`, photo, label: `${t('product.photo')} ${i + 1}` }));
    return [
      { key: 'full', view: 'full', label: t('product.viewFront') },
      { key: 'detail', view: 'detail', label: t('product.viewDetail') },
      { key: 'texture', view: 'texture', label: t('product.viewGrain') },
    ];
  }, [product, t]);

  if (!product || !artisan) {
    return (
      <div className="container-x py-16">
        <EmptyState icon={PackageSearch} title={t('product.notFoundTitle')} text={t('product.notFoundText')} action={<Link to="/explore" className="btn btn-primary">{t('nav.explore')}</Link>} />
      </div>
    );
  }

  const current = views[Math.min(active, views.length - 1)];
  const related = products.filter((p) => p.id !== product.id && (p.category === product.category || p.artisanId === product.artisanId)).slice(0, 4);
  const isOwner = user?.id === artisan.id;
  const name = tr(product, 'name');
  const first = artisan.name.split(' ')[0];

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: name, url });
      else { await navigator.clipboard.writeText(url); toast.success(t('toast.linkCopied')); }
    } catch { /* user cancelled */ }
  };

  const facts = [
    { icon: Gem, label: t('product.stone'), value: t('product.stoneValue') },
    product.size && { icon: Ruler, label: t('product.size'), value: product.size },
    product.weight && { icon: Weight, label: t('product.weight'), value: product.weight },
    product.finish && { icon: Sparkles, label: t('product.finish'), value: product.finish },
    { icon: Clock, label: t('product.availability'), value: product.madeToOrder ? t('product.leadTime', { n: product.leadDays }) : t('product.readyToShip') },
  ].filter(Boolean);

  return (
    <>
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-charcoal-600">
          <Link to="/explore" className="font-semibold text-terracotta-700 hover:underline">{t('nav.explore')}</Link> /
          <Link to={`/explore?category=${product.category}`} className="hover:underline">{label(categories, product.category)}</Link> /
          <span className="text-charcoal-900">{name}</span>
        </nav>
      </div>

      <div className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl3 bg-sandstone-100 shadow-soft">
            <SmartImage key={current.key} photo={current.photo} art={product.art} tone={product.tone} view={current.view} alt={`${name} — ${current.label}`} eager />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {views.map((v, i) => (
              <button key={v.key} onClick={() => setActive(i)} aria-label={v.label} aria-pressed={i === active} className={`aspect-square overflow-hidden rounded-xl border-4 transition ${i === active ? 'border-terracotta-600' : 'border-transparent hover:border-sandstone-300'}`}>
                <SmartImage photo={v.photo} art={product.art} tone={product.tone} view={v.view} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="font-medium text-olive-700">{label(categories, product.category)}</p>
          <h1 className="mt-1 text-3xl sm:text-4xl">{name}</h1>
          <p className="mt-4 font-display text-4xl font-semibold text-charcoal-900">{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm text-charcoal-500">{t('product.priceNote')}</p>

          <p className="mt-6 max-w-prose text-lg text-charcoal-700">{tr(product, 'description')}</p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {facts.map(({ icon: Icon, label: l, value }) => (
              <div key={l} className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-soft">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-600" aria-hidden />
                <div><dt className="text-sm text-charcoal-500">{l}</dt><dd className="font-semibold">{value}</dd></div>
              </div>
            ))}
          </dl>

          {/* Artisan */}
          <Link to={`/artisans/${artisan.id}`} className="mt-6 flex items-center gap-4 rounded-xl2 bg-sandstone-100 p-4 transition hover:bg-sandstone-200">
            <Avatar name={artisan.name} tone={artisan.tone === 'sage' ? 'olive' : artisan.tone === 'slate' ? 'charcoal' : 'terracotta'} photo={artisan.photo} />
            <div className="min-w-0">
              <p className="text-sm text-charcoal-600">{t('product.madeBy')}</p>
              <p className="truncate font-semibold">{tr(artisan, 'name')}</p>
              <p className="flex items-center gap-1 text-sm text-charcoal-600"><MapPin className="h-4 w-4 text-terracotta-600" aria-hidden /> {artisan.village}, {t('palnadu')}</p>
            </div>
          </Link>

          {/* Direct enquiry */}
          <div className="mt-6 space-y-3">
            {isOwner ? (
              <Link to="/artisan" className="btn btn-primary w-full">{t('product.manageInDashboard')}</Link>
            ) : (
              <>
                <button className="btn btn-primary w-full text-lg" onClick={() => setEnquiry(true)}><Send className="h-5 w-5" aria-hidden /> {t('product.enquire')}</button>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a className="btn btn-olive" target="_blank" rel="noreferrer" href={whatsappLink(artisan.phone, t('wa.productHello', { name, artisan: first }))}><MessageCircle className="h-5 w-5" aria-hidden /> WhatsApp</a>
                  <a className="btn btn-soft" href={`tel:+91${cleanPhone(artisan.phone)}`}><Phone className="h-5 w-5" aria-hidden /> {t('call')} {first}</a>
                </div>
                {(role === 'guest' || role === 'buyer') && (
                  <Link to={`/custom-order?artisan=${artisan.id}&ref=${product.id}`} className="btn btn-secondary w-full"><Hammer className="h-5 w-5" aria-hidden /> {t('product.customVersion')}</Link>
                )}
              </>
            )}
            <button onClick={share} className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 font-semibold text-charcoal-700 hover:text-terracotta-700"><Share2 className="h-5 w-5" aria-hidden /> {t('product.share')}</button>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-olive-50 p-4 text-[15px] text-olive-900"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> {t('product.safeNote')}</p>
        </div>
      </div>

      {product.care !== false && (
        <section className="container-x pb-8">
          <div className="card grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            <div><h2 className="text-2xl">{t('product.careTitle')}</h2><p className="mt-3 text-charcoal-700">{t('product.careText')}</p></div>
            <div><h2 className="text-2xl">{t('product.shippingTitle')}</h2><p className="mt-3 text-charcoal-700">{t('product.shippingText')}</p></div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-x pb-16 pt-8">
          <h2 className="mb-6 text-3xl">{t('product.related')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} artisan={artisan} product={product} />
    </>
  );
}
