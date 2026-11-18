import { Link } from 'react-router-dom';
import StoneArt from './StoneArt.jsx';
import { Logo } from './Navbar.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

/** Two-column frame for Login / Register: form on the left, carved panel on the right (desktop only). */
export default function AuthShell({ title, subtitle, children, wide = false }) {
  const { t } = useLang();
  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[1fr_0.8fr]">
      <div className="px-4 py-10 sm:px-8 lg:px-14">
        <div className={`mx-auto ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          <Link to="/" className="mb-8 inline-block lg:hidden"><Logo /></Link>
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 text-lg text-charcoal-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <aside className="grain relative hidden overflow-hidden bg-charcoal-900 lg:block" aria-hidden>
        <div className="absolute inset-0 opacity-60"><StoneArt art={{ kind: 'mandala' }} tone="slate" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent" />
        <div className="absolute inset-x-10 bottom-12">
          <p className="font-display text-3xl italic leading-snug text-ivory">{t('tagline')}</p>
          <p className="mt-3 max-w-sm text-sandstone-200">{t('auth.panelText')}</p>
        </div>
      </aside>
    </div>
  );
}
