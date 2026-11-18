import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Award, Languages, Phone, MessageCircle, Send, Hammer, UsersRound } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { specialties } from '../data/artisans.js';
import ProductCard from '../components/ProductCard.jsx';
import EnquiryModal from '../components/EnquiryModal.jsx';
import StoneArt from '../components/StoneArt.jsx';
import { Avatar, BackLink, EmptyState } from '../components/ui.jsx';
import { cleanPhone, whatsappLink } from '../utils/format.js';

export default function ArtisanProfile() {
  const { id } = useParams();
  const { getArtisan, products } = useStore();
  const { role } = useAuth();
  const { t, tr, label } = useLang();
  const [enquiry, setEnquiry] = useState(false);
  const artisan = getArtisan(id);

  if (!artisan) {
    return (
      <div className="container-x py-16">
        <EmptyState icon={UsersRound} title={t('artisans.notFoundTitle')} text={t('artisans.notFoundText')} action={<Link to="/artisans" className="btn btn-primary">{t('nav.artisans')}</Link>} />
      </div>
    );
  }

  const items = products.filter((p) => p.artisanId === artisan.id);
  const first = artisan.name.split(' ')[0];
  const art = items[0]?.art || { kind: 'mandala' };

  return (
    <>
      <section className="relative">
        <div className="h-48 overflow-hidden bg-charcoal-900 sm:h-60">
          <div className="h-full w-full opacity-70"><StoneArt art={{ kind: 'jali' }} tone={artisan.tone || 'slate'} title="" /></div>
          <div className="grain absolute inset-0 h-48 bg-charcoal-900/50 sm:h-60" aria-hidden />
        </div>
        <div className="container-x">
          <div className="-mt-16 flex flex-col gap-6 sm:-mt-20 md:flex-row md:items-end">
            <div className="rounded-full ring-8 ring-ivory"><Avatar name={artisan.name} size="xl" tone={artisan.tone === 'sage' ? 'olive' : artisan.tone === 'slate' ? 'charcoal' : 'terracotta'} photo={artisan.photo} /></div>
            <div className="pb-2">
              <h1 className="text-3xl sm:text-4xl">{tr(artisan, 'name')}</h1>
              <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-charcoal-700">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-5 w-5 text-terracotta-600" aria-hidden /> {artisan.village}, {t('palnadu')}</span>
                <span className="inline-flex items-center gap-1.5"><Award className="h-5 w-5 text-gold-600" aria-hidden /> {t('artisan.years', { n: artisan.experience })}</span>
                {artisan.languages?.length > 0 && <span className="inline-flex items-center gap-1.5"><Languages className="h-5 w-5 text-olive-600" aria-hidden /> {artisan.languages.join(', ')}</span>}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <BackLink to="/artisans">← {t('nav.artisans')}</BackLink>
          <h2 className="mt-3 text-2xl">{t('artisan.about', { name: first })}</h2>
          <p className="mt-3 max-w-prose text-lg text-charcoal-700">{tr(artisan, 'bio') || t('artisan.noBio')}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {artisan.specialties.map((s) => <span key={s} className="badge bg-sandstone-100 px-3 py-1.5 text-sm text-sandstone-900">{label(specialties, s)}</span>)}
          </div>
        </div>

        <aside className="card h-fit space-y-3 p-6">
          <h2 className="text-xl">{t('artisan.contactTitle', { name: first })}</h2>
          <button className="btn btn-primary w-full" onClick={() => setEnquiry(true)}><Send className="h-5 w-5" aria-hidden /> {t('enquiry.send')}</button>
          <a className="btn btn-olive w-full" target="_blank" rel="noreferrer" href={whatsappLink(artisan.phone, t('wa.artisanHello', { name: first }))}><MessageCircle className="h-5 w-5" aria-hidden /> WhatsApp</a>
          <a className="btn btn-soft w-full" href={`tel:+91${cleanPhone(artisan.phone)}`}><Phone className="h-5 w-5" aria-hidden /> {t('call')} +91 {artisan.phone}</a>
          {role !== 'artisan' && role !== 'admin' && (
            <Link to={`/custom-order?artisan=${artisan.id}`} className="btn btn-secondary w-full"><Hammer className="h-5 w-5" aria-hidden /> {t('artisan.askCustom')}</Link>
          )}
        </aside>
      </div>

      <section className="container-x pb-16">
        <h2 className="mb-6 text-3xl">{t('artisan.crafts', { n: items.length })}</h2>
        {items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        ) : (
          <EmptyState icon={Hammer} title={t('artisan.noProductsTitle')} text={t('artisan.noProductsText')} />
        )}
      </section>

      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} artisan={artisan} />
    </>
  );
}
