import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Send, MessageCircle, Phone, Hammer, Share2, Ruler, Weight, Gem,
  Clock, MapPin, PackageSearch, ShieldCheck, Sparkles, Star,
  CheckCircle2, Award, ChevronRight, Truck, RotateCcw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { categories } from '../data/products.js';
import { seedArtisans } from '../data/artisans.js';
import SmartImage from '../components/SmartImage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import { Avatar, EmptyState } from '../components/ui.jsx';
import { formatPrice, cleanPhone, whatsappLink } from '../utils/format.js';

export default function ProductDetails() {
  const { id } = useParams();
  const { getProduct, getArtisan, products } = useStore();
  const { role, user } = useAuth();
  const { t, tr, label } = useLang();
  const toast = useToast();
  const [active, setActive] = useState(0);
  const [enquiry, setEnquiry] = useState(false);
  const [qty, setQty] = useState(1);

  const product = getProduct(id);
  // Fallback: if Supabase artisans didn't load yet, try seed data directly
  const artisan = product
    ? (getArtisan(product.artisanId) || seedArtisans.find((a) => a.id === product.artisanId))
    : null;

  const views = useMemo(() => {
    if (!product) return [];
    if (product.photos?.length) return product.photos.map((photo, i) => ({ key: `p${i}`, photo, label: `Photo ${i + 1}` }));
    return [
      { key: 'full', view: 'full', label: t('product.viewFront') },
      { key: 'detail', view: 'detail', label: t('product.viewDetail') },
      { key: 'texture', view: 'texture', label: t('product.viewGrain') },
    ];
  }, [product, t]);

  if (!product || !artisan) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={PackageSearch}
          title={t('product.notFoundTitle')}
          text={t('product.notFoundText')}
          action={<Link to="/explore" className="btn btn-primary">{t('nav.explore')}</Link>}
        />
      </div>
    );
  }

  const current = views[Math.min(active, views.length - 1)];
  const related = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.artisanId === product.artisanId))
    .slice(0, 4);
  const isOwner = user?.id === artisan.id;
  const name = tr(product, 'name');
  const artisanName = tr(artisan, 'name');
  const first = artisan.name.split(' ')[0];

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: name, url });
      else { await navigator.clipboard.writeText(url); toast.success(t('toast.linkCopied')); }
    } catch { /* user cancelled */ }
  };

  const facts = [
    { icon: Gem,      label: t('product.stone'),        value: t('product.stoneValue') },
    product.size   && { icon: Ruler,    label: t('product.size'),         value: product.size },
    product.weight && { icon: Weight,   label: t('product.weight'),       value: product.weight },
    product.finish && { icon: Sparkles, label: t('product.finish'),       value: product.finish },
    {
      icon: Clock,
      label: t('product.availability'),
      value: product.madeToOrder ? t('product.leadTime', { n: product.leadDays }) : t('product.readyToShip'),
    },
  ].filter(Boolean);

  const artisanProductCount = products.filter((p) => p.artisanId === artisan.id).length;

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-charcoal-600">
          <Link to="/explore" className="font-semibold text-terracotta-700 hover:underline">{t('nav.explore')}</Link>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <Link to={`/explore?category=${product.category}`} className="hover:underline">{label(categories, product.category)}</Link>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <span className="text-charcoal-900 font-medium">{name}</span>
        </nav>
      </div>

      {/* ── Main grid: gallery + info ── */}
      <div className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-16">

        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl3 bg-sandstone-100 shadow-soft">
            <SmartImage
              key={current.key}
              photo={current.photo}
              art={product.art}
              tone={product.tone}
              view={current.view}
              alt={`${name} — ${current.label}`}
              eager
            />
          </div>
          {views.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {views.map((v, i) => (
                <button
                  key={v.key}
                  onClick={() => setActive(i)}
                  aria-label={v.label}
                  aria-pressed={i === active}
                  className={`aspect-square overflow-hidden rounded-xl border-4 transition ${i === active ? 'border-terracotta-600' : 'border-transparent hover:border-sandstone-300'}`}
                >
                  <SmartImage photo={v.photo} art={product.art} tone={product.tone} view={v.view} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col gap-6">

          {/* Title + price */}
          <div>
            <p className="font-medium text-olive-700 text-sm uppercase tracking-wider">{label(categories, product.category)}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">{name}</h1>
            <div className="mt-4 flex items-end gap-4">
              <p className="font-display text-4xl font-semibold text-charcoal-900">{formatPrice(product.price)}</p>
              <span className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${product.madeToOrder ? 'bg-sandstone-200 text-sandstone-900' : 'bg-olive-100 text-olive-800'}`}>
                {product.madeToOrder ? <Clock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                {product.madeToOrder ? t('product.madeToOrder') : t('product.inStock')}
              </span>
            </div>
            <p className="mt-1 text-sm text-charcoal-500">{t('product.priceNote')}</p>
          </div>

          {/* Description */}
          <p className="text-lg text-charcoal-700 leading-relaxed">{tr(product, 'description')}</p>

          {/* Spec facts */}
          <dl className="grid gap-3 sm:grid-cols-2">
            {facts.map(({ icon: Icon, label: l, value }) => (
              <div key={l} className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-soft">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-600" aria-hidden />
                <div><dt className="text-sm text-charcoal-500">{l}</dt><dd className="font-semibold">{value}</dd></div>
              </div>
            ))}
          </dl>

          {/* ── Quantity selector (only for non-owners) ── */}
          {!isOwner && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-charcoal-700">Quantity:</span>
              <div className="flex items-center rounded-full border border-sandstone-300 overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 text-xl font-bold text-charcoal-700 hover:bg-sandstone-100 transition"
                  aria-label="Decrease quantity"
                >−</button>
                <span className="w-10 text-center font-semibold text-charcoal-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 text-xl font-bold text-charcoal-700 hover:bg-sandstone-100 transition"
                  aria-label="Increase quantity"
                >+</button>
              </div>
              {qty > 1 && (
                <span className="text-sm text-terracotta-700 font-semibold">
                  Total: {formatPrice(product.price * qty)}
                </span>
              )}
            </div>
          )}

          {/* ── Order / action buttons ── */}
          <div className="space-y-3">
            {isOwner ? (
              <Link to="/artisan" className="btn btn-primary w-full">{t('product.manageInDashboard')}</Link>
            ) : (
              <>
                <button
                  className="btn btn-primary w-full text-lg"
                  onClick={() => setEnquiry(true)}
                >
                  <Send className="h-5 w-5" aria-hidden /> {t('product.enquire')} {qty > 1 ? `(${qty} pieces)` : ''}
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    className="btn btn-olive"
                    target="_blank"
                    rel="noreferrer"
                    href={whatsappLink(artisan.phone, t('wa.productHello', { name, artisan: first }))}
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden /> WhatsApp {first}
                  </a>
                  <a className="btn btn-soft" href={`tel:+91${cleanPhone(artisan.phone)}`}>
                    <Phone className="h-5 w-5" aria-hidden /> {t('call')} {first}
                  </a>
                </div>

                {(role === 'guest' || role === 'buyer') && (
                  <Link
                    to={`/custom-order?artisan=${artisan.id}&ref=${product.id}`}
                    className="btn btn-secondary w-full"
                  >
                    <Hammer className="h-5 w-5" aria-hidden /> {t('product.customVersion')}
                  </Link>
                )}
              </>
            )}

            <button
              onClick={share}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 font-semibold text-charcoal-700 hover:text-terracotta-700 transition"
            >
              <Share2 className="h-5 w-5" aria-hidden /> {t('product.share')}
            </button>
          </div>

          {/* Trust badge */}
          <p className="flex items-start gap-2 rounded-xl bg-olive-50 p-4 text-[15px] text-olive-900">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            {t('product.safeNote')}
          </p>

          {/* Delivery info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2 rounded-xl bg-sandstone-50 p-3.5">
              <Truck className="h-5 w-5 mt-0.5 shrink-0 text-terracotta-600" />
              <div>
                <p className="font-semibold text-sm">Safe Delivery</p>
                <p className="text-xs text-charcoal-600 mt-0.5">Packed & insured nationwide</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-sandstone-50 p-3.5">
              <RotateCcw className="h-5 w-5 mt-0.5 shrink-0 text-terracotta-600" />
              <div>
                <p className="font-semibold text-sm">Easy Returns</p>
                <p className="text-xs text-charcoal-600 mt-0.5">7-day return on damage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full-width Artisan Profile Card ── */}
      <section className="container-x pb-10">
        <div className="rounded-xl3 border border-sandstone-200 bg-white shadow-soft overflow-hidden">
          <div className="bg-sandstone-100 px-6 py-3">
            <p className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider">About the Artisan</p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar + quick stats */}
              <div className="flex flex-col items-center gap-3 sm:w-48 shrink-0">
                <Avatar
                  name={artisan.name}
                  size="lg"
                  tone={artisan.tone === 'sage' ? 'olive' : artisan.tone === 'slate' ? 'charcoal' : 'terracotta'}
                  photo={artisan.photo}
                />
                <p className="text-center font-display text-xl font-semibold">{artisanName}</p>
                <p className="flex items-center gap-1 text-sm text-charcoal-600">
                  <MapPin className="h-4 w-4 text-terracotta-600" />
                  {artisan.village}, Palnadu
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-terracotta-100 px-2.5 py-1 text-xs font-semibold text-terracotta-800">
                    <Award className="h-3.5 w-3.5" /> {artisan.experience} yrs exp.
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-olive-100 px-2.5 py-1 text-xs font-semibold text-olive-800">
                    <Star className="h-3.5 w-3.5" /> {artisanProductCount} crafts
                  </span>
                </div>
              </div>

              {/* Bio + details */}
              <div className="flex-1 min-w-0">
                <p className="text-charcoal-700 text-[16px] leading-relaxed">{tr(artisan, 'bio')}</p>

                {/* Languages */}
                {artisan.languages?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-charcoal-500 mb-2">Speaks</p>
                    <div className="flex flex-wrap gap-2">
                      {artisan.languages.map((lang) => (
                        <span key={lang} className="rounded-full bg-sandstone-100 px-3 py-1 text-sm font-medium text-charcoal-700">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {artisan.specialties?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-charcoal-500 mb-2">Specialises in</p>
                    <div className="flex flex-wrap gap-2">
                      {artisan.specialties.map((s) => (
                        <span key={s} className="rounded-full bg-terracotta-50 border border-terracotta-200 px-3 py-1 text-sm font-medium text-terracotta-800">
                          {label(categories, s) || s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA row */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/artisans/${artisan.id}`}
                    className="btn btn-soft btn-sm"
                  >
                    View full profile <ChevronRight className="h-4 w-4" />
                  </Link>
                  <a
                    className="btn btn-olive btn-sm"
                    target="_blank"
                    rel="noreferrer"
                    href={whatsappLink(artisan.phone, `Hi ${first}, I saw your work on CraftConnect and wanted to connect.`)}
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp {first}
                  </a>
                  <a className="btn btn-soft btn-sm" href={`tel:+91${cleanPhone(artisan.phone)}`}>
                    <Phone className="h-4 w-4" /> Call {first}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Care & Shipping ── */}
      {product.care !== false && (
        <section className="container-x pb-8">
          <div className="card grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl">{t('product.careTitle')}</h2>
              <p className="mt-3 text-charcoal-700">{t('product.careText')}</p>
            </div>
            <div>
              <h2 className="text-2xl">{t('product.shippingTitle')}</h2>
              <p className="mt-3 text-charcoal-700">{t('product.shippingText')}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Related crafts ── */}
      {related.length > 0 && (
        <section className="container-x pb-16 pt-4">
          <h2 className="mb-6 text-3xl">{t('product.related')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <EnquiryModal
        open={enquiry}
        onClose={() => setEnquiry(false)}
        artisan={artisan}
        product={product}
      />
    </>
  );
}
