import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Search, Users, GraduationCap, MessageCircle, Hammer, LogIn, LogOut, UserPlus, LayoutDashboard, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth, homeFor } from '../context/AuthContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Avatar } from './ui.jsx';

export function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-hidden>
        <rect width="64" height="64" rx="16" fill="#a14b2f" />
        <g transform="translate(32 34)" fill="#fbf7ee">
          <ellipse rx="5" ry="15" cy="-12" />
          <ellipse rx="5" ry="15" cy="-12" transform="rotate(50)" />
          <ellipse rx="5" ry="15" cy="-12" transform="rotate(-50)" />
          <ellipse rx="4" ry="12" cy="-10" transform="rotate(95)" opacity=".75" />
          <ellipse rx="4" ry="12" cy="-10" transform="rotate(-95)" opacity=".75" />
        </g>
      </svg>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-ivory' : 'text-charcoal-900'}`}>CraftConnect</span>
    </span>
  );
}

export function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang();
  const opt = (code, text) => (
    <button
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`min-h-[40px] rounded-full px-3.5 text-sm font-semibold transition ${lang === code ? 'bg-charcoal-900 text-ivory' : 'text-charcoal-700 hover:bg-sandstone-200'}`}
    >
      {text}
    </button>
  );
  return (
    <div className={`inline-flex items-center rounded-full bg-sandstone-100 p-1 ${className}`} role="group" aria-label="Language">
      {opt('en', 'English')}
      {opt('te', 'తెలుగు')}
    </div>
  );
}

export function useNavItems() {
  const { role } = useAuth();
  const { t } = useLang();
  const items = [
    { to: '/', label: t('nav.home'), icon: Home, end: true },
    { to: '/explore', label: t('nav.explore'), icon: Search },
    { to: '/artisans', label: t('nav.artisans'), icon: Users },
    { to: '/learn', label: t('nav.learn'), icon: GraduationCap },
    { to: '/community', label: t('nav.community'), icon: MessageCircle },
  ];
  if (role === 'guest' || role === 'buyer') items.splice(3, 0, { to: '/custom-order', label: t('nav.customOrder'), icon: Hammer });
  if (role === 'artisan') items.push({ to: '/artisan', label: t('nav.myDashboard'), icon: LayoutDashboard });
  if (role === 'buyer') items.push({ to: '/buyer', label: t('nav.myDashboard'), icon: LayoutDashboard });
  if (role === 'admin') items.push({ to: '/admin', label: t('nav.admin'), icon: ShieldCheck });
  return items;
}

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { t } = useLang();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const items = useNavItems();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const doLogout = () => {
    logout();
    toast.success(t('toast.loggedOut'));
    navigate('/');
  };

  const linkCls = ({ isActive }) =>
    `rounded-full px-4 py-1.5 text-[14px] font-medium transition ${isActive ? 'bg-terracotta-100 text-terracotta-800' : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-sandstone-100'}`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-sandstone-200 bg-ivory/95 backdrop-blur">
        <div className="flex h-[64px] w-full items-center justify-between gap-6 px-6 sm:px-10 lg:px-16 xl:px-24">
          <Link to="/" aria-label="CraftConnect home" className="shrink-0"><Logo /></Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Main">
            {items.map((i) => <NavLink key={i.to} to={i.to} end={i.end} className={linkCls}>{i.label}</NavLink>)}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LangToggle />
            {user ? (
              <>
                <Link to={homeFor(role)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-sandstone-100" title={t('nav.myDashboard')}>
                  <Avatar name={user.name} size="sm" />
                  <span className="max-w-[120px] truncate text-sm font-semibold">{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={doLogout} className="btn btn-soft btn-sm"><LogOut className="h-4 w-4" aria-hidden /> {t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-soft btn-sm"><LogIn className="h-4 w-4" aria-hidden /> {t('nav.login')}</Link>
                <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(true)} className="grid h-12 w-12 place-items-center rounded-full bg-sandstone-100 lg:hidden" aria-label={t('nav.menu')} aria-expanded={open}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
          <div className="absolute inset-0 bg-charcoal-900/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm animate-slide flex-col bg-ivory shadow-lift">
            <div className="flex h-[64px] items-center justify-between border-b border-sandstone-200 px-5">
              <Logo />
              <button onClick={() => setOpen(false)} className="grid h-12 w-12 place-items-center rounded-full hover:bg-sandstone-100" aria-label={t('close')}><X className="h-6 w-6" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile">
              {user && (
                <div className="mb-4 flex items-center gap-3 rounded-xl2 bg-sandstone-100 p-4">
                  <Avatar name={user.name} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="text-sm text-charcoal-600">{t(`role.${role}`)}</p>
                  </div>
                </div>
              )}
              <ul className="space-y-1">
                {items.map((i) => {
                  const Icon = i.icon;
                  return (
                    <li key={i.to}>
                      <NavLink to={i.to} end={i.end} className={({ isActive }) => `flex min-h-[56px] items-center gap-4 rounded-xl px-4 text-lg font-semibold ${isActive ? 'bg-terracotta-100 text-terracotta-800' : 'text-charcoal-800 hover:bg-sandstone-100'}`}>
                        <Icon className="h-6 w-6" aria-hidden /> {i.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="space-y-3 border-t border-sandstone-200 p-4">
              <LangToggle className="w-full justify-center [&>button]:flex-1" />
              {user ? (
                <button onClick={doLogout} className="btn btn-soft w-full"><LogOut className="h-5 w-5" aria-hidden /> {t('nav.logout')}</button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="btn btn-soft"><LogIn className="h-5 w-5" aria-hidden /> {t('nav.login')}</Link>
                  <Link to="/register" className="btn btn-primary"><UserPlus className="h-5 w-5" aria-hidden /> {t('nav.register')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomBar />
    </>
  );
}

/** Thumb-reach navigation on phones: five big targets with icons and words. */
function BottomBar() {
  const { role } = useAuth();
  const { t } = useLang();
  const account = role === 'guest' ? { to: '/login', label: t('nav.login'), icon: UserRound } : { to: homeFor(role), label: t('nav.account'), icon: UserRound };
  const tabs = [
    { to: '/', label: t('nav.home'), icon: Home, end: true },
    { to: '/explore', label: t('nav.crafts'), icon: Search },
    { to: '/learn', label: t('nav.learn'), icon: GraduationCap },
    { to: '/community', label: t('nav.community'), icon: MessageCircle },
    account,
  ];
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-sandstone-200 bg-ivory/95 backdrop-blur lg:hidden" aria-label="Quick">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => `flex min-h-[64px] flex-col items-center justify-center gap-0.5 text-[12px] font-semibold ${isActive ? 'text-terracotta-700' : 'text-charcoal-600'}`}>
            <Icon className="h-6 w-6" aria-hidden />
            <span className="max-w-full truncate px-1">{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
