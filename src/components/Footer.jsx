import { Link } from 'react-router-dom';
import { MapPin, Mail } from 'lucide-react';
import { Logo, LangToggle } from './Navbar.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Footer() {
  const { t } = useLang();
  const { role } = useAuth();
  const links = [
    { to: '/explore', label: t('nav.explore') },
    { to: '/artisans', label: t('nav.artisans') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/community', label: t('nav.community') },
    ...(role === 'guest' || role === 'buyer' ? [{ to: '/custom-order', label: t('nav.customOrder') }] : []),
  ];
  return (
    <footer className="grain relative mt-10 bg-charcoal-900 pb-24 pt-14 text-sandstone-200 lg:pb-12">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-3 font-display text-xl italic text-gold-300">{t('tagline')}</p>
          <p className="mt-4 max-w-md text-[15px] text-sandstone-300">{t('footer.about')}</p>
        </div>
        <div>
          <h3 className="mb-3 font-sans text-base font-semibold text-ivory">{t('footer.explore')}</h3>
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.to}><Link to={l.to} className="inline-flex min-h-[40px] items-center hover:text-ivory hover:underline">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-sans text-base font-semibold text-ivory">{t('footer.join')}</h3>
          <ul className="space-y-1">
            <li><Link to="/register?role=artisan" className="inline-flex min-h-[40px] items-center hover:text-ivory hover:underline">{t('footer.joinArtisan')}</Link></li>
            <li><Link to="/register?role=buyer" className="inline-flex min-h-[40px] items-center hover:text-ivory hover:underline">{t('footer.joinBuyer')}</Link></li>
          </ul>
          <p className="mt-5 flex items-start gap-2 text-[15px]"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden /> {t('footer.place')}</p>
          <p className="mt-2 flex items-start gap-2 text-[15px]"><Mail className="mt-1 h-4 w-4 shrink-0" aria-hidden /> hello@craftconnect.example</p>
        </div>
      </div>
      <div className="container-x mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 CraftConnect. {t('footer.rights')}</p>
        <LangToggle />
      </div>
    </footer>
  );
}
