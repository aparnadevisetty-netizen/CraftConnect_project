import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, Inbox, UserRound, Plus, Pencil, Trash2, Eye, Save, MessageSquare, Hammer, Star, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import { specialties, villages } from '../../data/artisans.js';
import { categories } from '../../data/products.js';
import RequestList from '../../components/RequestList.jsx';
import ProductFormModal from '../../components/ProductFormModal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import FormField from '../../components/FormField.jsx';
import SmartImage from '../../components/SmartImage.jsx';
import { Avatar, StatCard, Tabs, EmptyState } from '../../components/ui.jsx';
import { formatPrice } from '../../utils/format.js';

export default function ArtisanDashboard() {
  const { user } = useAuth();
  const { products, requests, posts, getArtisan, upsertArtisan, updateUser, addProduct, updateProduct, removeProduct } = useStore();
  const toast = useToast();
  const { t, tr, label } = useLang();
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null); // product | 'new' | null
  const [deleting, setDeleting] = useState(null);
  const artisan = getArtisan(user.id);

  const mine = useMemo(() => products.filter((p) => p.artisanId === user.id), [products, user.id]);
  const incoming = useMemo(() => requests.filter((r) => r.artisanId === user.id || (r.type === 'custom' && !r.artisanId && !['cancelled', 'closed'].includes(r.status))), [requests, user.id]);
  const needsReply = incoming.filter((r) => r.status === 'new').length;
  const myPosts = posts.filter((p) => p.authorId === user.id).length;

  const saveProduct = (data) => {
    if (editing && editing !== 'new') {
      updateProduct(editing.id, data);
      toast.success(t('toast.productSaved'));
    } else {
      addProduct({ ...data, artisanId: user.id });
      toast.success(t('toast.productAdded'));
    }
    setEditing(null);
  };

  const tabs = [
    { key: 'overview', label: t('dash.overview'), icon: LayoutDashboard },
    { key: 'products', label: t('dash.myProducts'), icon: Package, count: 0 },
    { key: 'enquiries', label: t('dash.enquiries'), icon: Inbox, count: needsReply },
    { key: 'profile', label: t('dash.myProfile'), icon: UserRound },
  ];

  return (
    <div className="container-x py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <h1 className="text-3xl">{t('dash.hello', { name: user.name.split(' ')[0] })}</h1>
            <p className="text-charcoal-600">{t('dash.artisanSub')}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => { setTab('products'); setEditing('new'); }}><Plus className="h-5 w-5" aria-hidden /> {t('product.add')}</button>
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Package} label={t('dash.statProducts')} value={mine.length} />
              <StatCard icon={Inbox} label={t('dash.statNew')} value={needsReply} tone="gold" />
              <StatCard icon={Hammer} label={t('dash.statCustom')} value={incoming.filter((r) => r.type === 'custom').length} tone="olive" />
              <StatCard icon={MessageSquare} label={t('dash.statPosts')} value={myPosts} tone="charcoal" />
            </div>
            {!artisan?.bio && (
              <div className="flex flex-col gap-3 rounded-xl2 bg-sandstone-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-3 text-lg"><Star className="h-6 w-6 shrink-0 text-gold-600" aria-hidden /> {t('dash.completeProfile')}</p>
                <button className="btn btn-primary btn-sm" onClick={() => setTab('profile')}>{t('dash.myProfile')}</button>
              </div>
            )}
            <section>
              <h2 className="mb-4 text-2xl">{t('dash.recentEnquiries')}</h2>
              <RequestList requests={incoming.slice(0, 3)} viewer="artisan" />
              {incoming.length > 3 && <button className="btn btn-soft mt-4" onClick={() => setTab('enquiries')}>{t('seeAll')}</button>}
            </section>
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg text-charcoal-600">{t('dash.productsHelp')}</p>
              <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}><Plus className="h-5 w-5" aria-hidden /> {t('product.add')}</button>
            </div>
            {mine.length === 0 ? (
              <EmptyState icon={Package} title={t('dash.noProductsTitle')} text={t('dash.noProductsText')} action={<button className="btn btn-primary" onClick={() => setEditing('new')}><Plus className="h-5 w-5" aria-hidden /> {t('product.add')}</button>} />
            ) : (
              <ul className="space-y-3">
                {mine.map((p) => (
                  <li key={p.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-32"><SmartImage photo={p.photos?.[0]} art={p.art} tone={p.tone} alt="" /></div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg">{tr(p, 'name')}</h3>
                      <p className="text-sm text-charcoal-600">{label(categories, p.category)} · {formatPrice(p.price)}</p>
                      <span className={`badge mt-2 ${p.madeToOrder ? 'bg-sandstone-200 text-sandstone-900' : 'bg-olive-100 text-olive-800'}`}>{p.madeToOrder ? <><Clock className="h-3.5 w-3.5" aria-hidden /> {t('product.madeToOrder')}</> : t('product.inStock')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/crafts/${p.id}`} className="btn btn-soft btn-sm"><Eye className="h-4 w-4" aria-hidden /> {t('view')}</Link>
                      <button className="btn btn-soft btn-sm" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" aria-hidden /> {t('edit')}</button>
                      <button className="btn btn-soft btn-sm !text-red-700" onClick={() => setDeleting(p)}><Trash2 className="h-4 w-4" aria-hidden /> {t('delete')}</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === 'enquiries' && <RequestList requests={incoming} viewer="artisan" />}
        {tab === 'profile' && artisan && <ProfileForm artisan={artisan} onSave={(changes, name) => { upsertArtisan({ id: artisan.id, ...changes }); updateUser(user.id, { name }); toast.success(t('toast.profileSaved')); }} />}
      </div>

      <ProductFormModal open={!!editing} product={editing && editing !== 'new' ? editing : null} onClose={() => setEditing(null)} onSave={saveProduct} />
      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={() => { removeProduct(deleting.id); toast.success(t('toast.productDeleted')); setDeleting(null); }}
        title={t('product.deleteTitle')}
        message={t('product.deleteText', { name: deleting ? tr(deleting, 'name') : '' })}
        confirmLabel={t('delete')}
      />
    </div>
  );
}

function ProfileForm({ artisan, onSave }) {
  const { t, label } = useLang();
  const [f, setF] = useState({ name: artisan.name, name_te: artisan.name_te || '', village: artisan.village, experience: artisan.experience ?? '', bio: artisan.bio || '', bio_te: artisan.bio_te || '', languages: (artisan.languages || []).join(', '), specialties: artisan.specialties || [] });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const toggle = (k) => setF((x) => ({ ...x, specialties: x.specialties.includes(k) ? x.specialties.filter((s) => s !== k) : [...x.specialties, k] }));

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (f.name.trim().length < 3) err.name = t('err.name');
    if (Number(f.experience) < 0 || Number(f.experience) > 70) err.experience = t('err.experience');
    if (f.bio && f.bio.trim().length < 20) err.bio = t('err.bioShort');
    if (!f.specialties.length) err.specialties = t('err.specialties');
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({ name: f.name.trim(), name_te: f.name_te.trim(), village: f.village, experience: Number(f.experience) || 0, bio: f.bio.trim(), bio_te: f.bio_te.trim(), languages: f.languages.split(',').map((x) => x.trim()).filter(Boolean), specialties: f.specialties }, f.name.trim());
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-3xl space-y-5 p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="pr-name" label={t('field.fullName')} error={errors.name}><input id="pr-name" className={`input ${errors.name ? 'input-error' : ''}`} value={f.name} onChange={set('name')} /></FormField>
        <FormField id="pr-name-te" label={t('profile.nameTe')} optional optionalLabel={t('optional')}><input id="pr-name-te" lang="te" className="input" value={f.name_te} onChange={set('name_te')} /></FormField>
        <FormField id="pr-village" label={t('field.village')}>
          <select id="pr-village" className="input" value={f.village} onChange={set('village')}>{Array.from(new Set([...villages, f.village])).map((v) => <option key={v}>{v}</option>)}</select>
        </FormField>
        <FormField id="pr-exp" label={t('field.experience')} error={errors.experience}><input id="pr-exp" type="number" min="0" max="70" className={`input ${errors.experience ? 'input-error' : ''}`} value={f.experience} onChange={set('experience')} /></FormField>
      </div>
      <fieldset>
        <legend className="label">{t('register.whatYouMake')}</legend>
        <div className="flex flex-wrap gap-2">
          {specialties.map((s) => <button type="button" key={s.key} onClick={() => toggle(s.key)} aria-pressed={f.specialties.includes(s.key)} className={`chip ${f.specialties.includes(s.key) ? 'chip-active' : ''}`}>{label(specialties, s.key)}</button>)}
        </div>
        {errors.specialties && <p className="error-text" role="alert">{errors.specialties}</p>}
      </fieldset>
      <FormField id="pr-bio" label={t('profile.bio')} error={errors.bio} hint={t('profile.bioHint')}><textarea id="pr-bio" rows={4} className={`input ${errors.bio ? 'input-error' : ''}`} value={f.bio} onChange={set('bio')} /></FormField>
      <FormField id="pr-bio-te" label={t('profile.bioTe')} optional optionalLabel={t('optional')}><textarea id="pr-bio-te" lang="te" rows={3} className="input" value={f.bio_te} onChange={set('bio_te')} /></FormField>
      <FormField id="pr-lang" label={t('profile.languages')} hint={t('profile.languagesHint')}><input id="pr-lang" className="input" value={f.languages} onChange={set('languages')} /></FormField>
      <button className="btn btn-primary"><Save className="h-5 w-5" aria-hidden /> {t('saveChanges')}</button>
    </form>
  );
}
