import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Store, MessageSquareText, Hammer, GraduationCap, Search, Send, Truck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import StoneArt from '../components/StoneArt.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ArtisanCard from '../components/ArtisanCard.jsx';
import VideoCard from '../components/VideoCard.jsx';
import PostCard from '../components/PostCard.jsx';
import { SectionHeading } from '../components/ui.jsx';
import { formatPrice } from '../utils/format.js';

function Hero() {
  const { products, artisans } = useStore();
  const { t, tr } = useLang();
  const hero = products.find((p) => p.id === 'p1') || products[0];
  const villages = new Set(artisans.map((a) => a.village)).size;
  return (
    <section className="relative overflow-hidden bg-sandstone-100">
      <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-terracotta-100/70" aria-hidden />
      <div className="container-x relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-sm font-semibold text-olive-800 shadow-soft">
            <MapPin className="h-4 w-4 text-terracotta-600" aria-hidden /> {t('home.eyebrow')}
          </p>
          <h1 className="mt-6 text-[2.6rem] font-bold leading-[1.08] sm:text-6xl lg:text-[4.2rem]">{t('tagline')}</h1>
          <p className="mt-6 max-w-xl text-lg text-charcoal-700 sm:text-xl">{t('home.heroText')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/explore" className="btn btn-primary px-8 text-lg">{t('home.ctaExplore')} <ArrowRight className="h-5 w-5" aria-hidden /></Link>
            <Link to="/artisans" className="btn btn-secondary px-8 text-lg">{t('home.ctaArtisans')}</Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-sandstone-300 pt-6">
            {[[artisans.length, t('home.statArtisans')], [products.length, t('home.statCrafts')], [villages, t('home.statVillages')]].map(([n, l]) => (
              <div key={l}><dd className="font-display text-3xl font-semibold text-charcoal-900">{n}</dd><dt className="text-sm text-charcoal-600">{l}</dt></div>
            ))}
          </dl>
        </div>

        {/* The memorable moment: a carved temple niche that lights up on load */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-charcoal-900 shadow-lift ring-8 ring-ivory">
            <div className="grain absolute inset-0" aria-hidden />
            <div className="absolute inset-x-8 top-6 bottom-0 rounded-t-[999px] border-2 border-gold-500/50" aria-hidden />
            <div className="absolute left-1/2 top-[30%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pop rounded-full bg-gold-400/30 blur-3xl [animation-duration:1.4s]" aria-hidden />
            <div className="absolute inset-x-6 bottom-6 top-14 animate-rise [animation-delay:.2s] [animation-duration:1s]">
              <StoneArt art={hero.art} tone="sand" title={tr(hero, 'name')} className="bg-transparent !bg-none" />
            </div>
          </div>
          <Link to={`/crafts/${hero.id}`} className="absolute -bottom-5 left-1/2 flex w-[88%] -translate-x-1/2 items-center justify-between gap-3 rounded-xl2 bg-ivory p-4 shadow-lift transition hover:-translate-y-0.5 hover:-translate-x-1/2">
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-semibold">{tr(hero, 'name')}</span>
              <span className="text-sm text-charcoal-600">{t('home.heroCardBy', { name: tr(artisans.find((a) => a.id === hero.artisanId) || {}, 'name') })}</span>
            </span>
            <span className="shrink-0 font-display text-xl font-semibold text-terracotta-700">{formatPrice(hero.price)}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  const { t } = useLang();
  const features = [
    { icon: Store, title: t('home.f1t'), text: t('home.f1x') },
    { icon: MessageSquareText, title: t('home.f2t'), text: t('home.f2x') },
    { icon: Hammer, title: t('home.f3t'), text: t('home.f3x') },
    { icon: GraduationCap, title: t('home.f4t'), text: t('home.f4x') },
  ];
  return (
    <section className="container-x section-y">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl">{t('home.introTitle')}</h2>
          <p className="mt-5 text-lg text-charcoal-700">{t('home.introP1')}</p>
          <p className="mt-4 text-lg text-charcoal-700">{t('home.introP2')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-olive-100 text-olive-700"><Icon className="h-6 w-6" aria-hidden /></span>
              <h3 className="mt-4 text-xl">{title}</h3>
              <p className="mt-2 text-[15px] text-charcoal-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useLang();
  const steps = [
    { icon: Search, title: t('home.s1t'), text: t('home.s1x') },
    { icon: Send, title: t('home.s2t'), text: t('home.s2x') },
    { icon: Truck, title: t('home.s3t'), text: t('home.s3x') },
  ];
  return (
    <section className="bg-sandstone-100">
      <div className="container-x section-y">
        <SectionHeading title={t('home.howTitle')} subtitle={t('home.howSub')} />
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-xl2 bg-ivory p-6 shadow-soft">
              <span className="absolute -top-4 left-6 grid h-9 w-9 place-items-center rounded-full bg-terracotta-600 font-display text-lg font-semibold text-ivory">{i + 1}</span>
              <Icon className="mt-3 h-8 w-8 text-terracotta-600" aria-hidden />
              <h3 className="mt-3 text-xl">{title}</h3>
              <p className="mt-2 text-charcoal-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Home() {
  const { products, artisans, videos, posts } = useStore();
  const { role } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const featuredArtisans = artisans.filter((a) => a.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <Hero />
      <Intro />
      <HowItWorks />

      <section className="container-x section-y">
        <SectionHeading
          title={t('home.featuredTitle')}
          subtitle={t('home.featuredSub')}
          action={<Link to="/explore" className="btn btn-soft">{t('seeAll')} <ArrowRight className="h-5 w-5" aria-hidden /></Link>}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="bg-sandstone-50">
        <div className="container-x section-y">
          <SectionHeading
            title={t('home.artisansTitle')}
            subtitle={t('home.artisansSub')}
            action={<Link to="/artisans" className="btn btn-soft">{t('seeAll')} <ArrowRight className="h-5 w-5" aria-hidden /></Link>}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featuredArtisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}</div>
        </div>
      </section>

      <section className="grain relative bg-olive-900">
        <div className="container-x section-y relative">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl text-ivory sm:text-4xl">{t('home.learnTitle')}</h2>
              <p className="mt-3 text-lg text-olive-100">{t('home.learnSub')}</p>
            </div>
            <Link to="/learn" className="btn bg-ivory text-charcoal-900 hover:bg-sandstone-100">{t('home.learnAll')} <ArrowRight className="h-5 w-5" aria-hidden /></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {videos.slice(0, 3).map((v) => <VideoCard key={v.id} video={v} onPlay={(vid) => navigate(`/learn?v=${vid.id}`)} />)}
          </div>
        </div>
      </section>

      <section className="container-x section-y">
        <SectionHeading
          title={t('home.communityTitle')}
          subtitle={t('home.communitySub')}
          action={<Link to="/community" className="btn btn-soft">{t('home.communityAll')} <ArrowRight className="h-5 w-5" aria-hidden /></Link>}
        />
        <div className="grid gap-6 md:grid-cols-3">{latestPosts.map((p) => <PostCard key={p.id} post={p} compact />)}</div>
      </section>

      {role === 'guest' && (
        <section className="container-x pb-6">
          <div className="grid gap-6 overflow-hidden rounded-xl3 bg-terracotta-700 p-8 text-ivory sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl text-ivory sm:text-4xl">{t('home.ctaTitle')}</h2>
              <p className="mt-3 max-w-xl text-lg text-terracotta-100">{t('home.ctaText')}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link to="/register?role=artisan" className="btn bg-ivory text-terracotta-800 hover:bg-sandstone-100">{t('footer.joinArtisan')}</Link>
              <Link to="/register?role=buyer" className="btn border-2 border-ivory/70 text-ivory hover:bg-ivory/10"><Heart className="h-5 w-5" aria-hidden /> {t('footer.joinBuyer')}</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
