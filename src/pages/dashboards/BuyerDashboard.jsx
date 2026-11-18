import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Clock, IndianRupee, CheckCircle2, Hammer, Search, UserRound, ClipboardList, Save } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import RequestList from '../../components/RequestList.jsx';
import FormField from '../../components/FormField.jsx';
import { Avatar, StatCard, Tabs } from '../../components/ui.jsx';

export default function BuyerDashboard() {
  const { user, updateProfile } = useAuth();
  const { requests } = useStore();
  const toast = useToast();
  const { t } = useLang();
  const [tab, setTab] = useState('requests');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: user.name, city: user.city || '' });
  const [error, setError] = useState('');

  const mine = useMemo(() => requests.filter((r) => r.buyerId === user.id), [requests, user.id]);
  const counts = {
    open: mine.filter((r) => ['new', 'replied'].includes(r.status)).length,
    quoted: mine.filter((r) => r.status === 'quoted').length,
    accepted: mine.filter((r) => r.status === 'accepted').length,
    custom: mine.filter((r) => r.type === 'custom').length,
  };
  const shown = mine.filter((r) => filter === 'all' || (filter === 'open' && ['new', 'replied'].includes(r.status)) || (filter === 'quoted' && r.status === 'quoted') || (filter === 'done' && ['accepted', 'closed', 'declined', 'cancelled'].includes(r.status)) || (filter === 'custom' && r.type === 'custom'));

  const save = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError(t('err.name'));
    updateProfile({ name: form.name.trim(), city: form.city.trim() });
    setError('');
    toast.success(t('toast.profileSaved'));
  };

  const tabs = [
    { key: 'requests', label: t('dash.myRequests'), icon: ClipboardList, count: counts.quoted },
    { key: 'profile', label: t('dash.myProfile'), icon: UserRound },
  ];
  const filters = [
    { key: 'all', label: t('all') }, { key: 'open', label: t('dash.fOpen') }, { key: 'quoted', label: t('dash.fQuoted'), count: counts.quoted },
    { key: 'custom', label: t('dash.fCustom') }, { key: 'done', label: t('dash.fDone') },
  ];

  return (
    <div className="container-x py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" tone="olive" />
          <div>
            <h1 className="text-3xl">{t('dash.hello', { name: user.name.split(' ')[0] })}</h1>
            <p className="text-charcoal-600">{t('dash.buyerSub')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/explore" className="btn btn-soft btn-sm"><Search className="h-4 w-4" aria-hidden /> {t('nav.explore')}</Link>
          <Link to="/custom-order" className="btn btn-primary btn-sm"><Hammer className="h-4 w-4" aria-hidden /> {t('nav.customOrder')}</Link>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} label={t('dash.statWaiting')} value={counts.open} tone="gold" />
        <StatCard icon={IndianRupee} label={t('dash.statQuotes')} value={counts.quoted} />
        <StatCard icon={CheckCircle2} label={t('dash.statAccepted')} value={counts.accepted} tone="olive" />
        <StatCard icon={Hammer} label={t('dash.statCustomMine')} value={counts.custom} tone="charcoal" />
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'requests' && (
          <div className="space-y-5">
            <Tabs tabs={filters} value={filter} onChange={setFilter} />
            <RequestList
              requests={shown}
              viewer="buyer"
              emptyAction={<div className="flex flex-wrap justify-center gap-3"><Link to="/explore" className="btn btn-primary btn-sm">{t('nav.explore')}</Link><Link to="/custom-order" className="btn btn-soft btn-sm">{t('nav.customOrder')}</Link></div>}
            />
          </div>
        )}
        {tab === 'profile' && (
          <form onSubmit={save} className="card mx-auto max-w-xl space-y-5 p-6 sm:p-8" noValidate>
            <FormField id="bp-name" label={t('field.fullName')} error={error}>
              <input id="bp-name" className={`input ${error ? 'input-error' : ''}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormField>
            <FormField id="bp-phone" label={t('field.phone')} hint={t('profile.phoneLocked')}>
              <input id="bp-phone" className="input bg-sandstone-50" value={user.phone} readOnly />
            </FormField>
            <FormField id="bp-city" label={t('field.city')} optional optionalLabel={t('optional')}>
              <input id="bp-city" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </FormField>
            <button className="btn btn-primary"><Save className="h-5 w-5" aria-hidden /> {t('saveChanges')}</button>
          </form>
        )}
      </div>
    </div>
  );
}
