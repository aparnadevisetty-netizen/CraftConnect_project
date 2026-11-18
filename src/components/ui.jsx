import { Link } from 'react-router-dom';
import { initials } from '../utils/format.js';
import { useLang } from '../i18n/LanguageContext.jsx';

export function Avatar({ name, size = 'md', tone = 'terracotta', photo }) {
  const sizes = { sm: 'h-10 w-10 text-sm', md: 'h-12 w-12 text-base', lg: 'h-20 w-20 text-2xl', xl: 'h-28 w-28 text-4xl' };
  const tones = { terracotta: 'bg-terracotta-600', olive: 'bg-olive-600', charcoal: 'bg-charcoal-700', gold: 'bg-gold-600' };
  if (photo) return <img src={photo} alt={name} loading="lazy" className={`${sizes[size]} shrink-0 rounded-full object-cover`} />;
  return (
    <span className={`${sizes[size]} ${tones[tone] || tones.terracotta} grid shrink-0 place-items-center rounded-full font-display font-semibold text-ivory`} aria-hidden>
      {initials(name)}
    </span>
  );
}

export function SectionHeading({ title, subtitle, action, align = 'left' }) {
  return (
    <div className={`mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between ${align === 'center' ? 'text-center sm:flex-col sm:items-center' : ''}`}>
      <div className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-lg text-charcoal-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <header className="relative overflow-hidden bg-charcoal-900 text-ivory">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="container-x relative py-12 sm:py-16">
        <h1 className="max-w-3xl text-4xl text-ivory sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-sandstone-200">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
      <div className="h-1.5 bg-gradient-to-r from-terracotta-600 via-gold-500 to-olive-600" aria-hidden />
    </header>
  );
}

export function EmptyState({ icon: Icon, title, text, action, level = 3 }) {
  const Heading = `h${level}`;
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 px-6 py-12 text-center">
      {Icon && <span className="grid h-16 w-16 place-items-center rounded-full bg-sandstone-100 text-terracotta-600"><Icon className="h-8 w-8" aria-hidden /></span>}
      <Heading className="text-2xl">{title}</Heading>
      {text && <p className="text-charcoal-600">{text}</p>}
      {action}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, tone = 'terracotta' }) {
  const tones = { terracotta: 'bg-terracotta-100 text-terracotta-700', olive: 'bg-olive-100 text-olive-700', gold: 'bg-sandstone-200 text-gold-600', charcoal: 'bg-charcoal-100 text-charcoal-700' };
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}><Icon className="h-7 w-7" aria-hidden /></span>
      <div>
        <p className="font-display text-3xl font-semibold leading-none text-charcoal-900">{value}</p>
        <p className="mt-1 text-sm text-charcoal-600">{label}</p>
      </div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.key === value;
        return (
          <button key={tab.key} role="tab" aria-selected={active} onClick={() => onChange(tab.key)} className={`chip ${active ? 'chip-active' : ''}`}>
            {Icon && <Icon className="h-5 w-5" aria-hidden />}
            {tab.label}
            {tab.count > 0 && <span className={`rounded-full px-2 text-xs font-bold ${active ? 'bg-ivory/25' : 'bg-terracotta-100 text-terracotta-700'}`}>{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

const STATUS_STYLES = {
  new: 'bg-sandstone-200 text-sandstone-900',
  replied: 'bg-olive-100 text-olive-800',
  quoted: 'bg-gold-300/60 text-sandstone-900',
  accepted: 'bg-olive-600 text-ivory',
  declined: 'bg-red-100 text-red-800',
  closed: 'bg-charcoal-100 text-charcoal-700',
  cancelled: 'bg-charcoal-100 text-charcoal-600',
};
export function StatusBadge({ status }) {
  const { t } = useLang();
  return <span className={`badge ${STATUS_STYLES[status] || STATUS_STYLES.new}`}>{t(`status.${status}`)}</span>;
}

export function RoleBadge({ role }) {
  const { t } = useLang();
  const cls = { artisan: 'bg-terracotta-100 text-terracotta-800', buyer: 'bg-olive-100 text-olive-800', admin: 'bg-charcoal-800 text-ivory' }[role] || '';
  return <span className={`badge ${cls}`}>{t(`role.${role}`)}</span>;
}

export function BackLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-terracotta-700 hover:underline">
      {children}
    </Link>
  );
}
