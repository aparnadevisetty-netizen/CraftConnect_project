import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Package, PlayCircle, MessagesSquare, Ban, UserCheck, Trash2, Star, Eye, Plus, Search, Inbox, RotateCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import { categories } from '../../data/products.js';
import { learningCategories } from '../../data/learning.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import FormField from '../../components/FormField.jsx';
import Modal from '../../components/Modal.jsx';
import { RoleBadge, StatCard, Tabs, EmptyState } from '../../components/ui.jsx';
import { formatDate, formatPrice, timeAgo } from '../../utils/format.js';

export default function AdminDashboard() {
  const store = useStore();
  const { user } = useAuth();
  const toast = useToast();
  const { t, tr, label, lang } = useLang();
  const [tab, setTab] = useState('overview');
  const [confirm, setConfirm] = useState(null); // { kind, item }
  const [q, setQ] = useState('');
  const [videoModal, setVideoModal] = useState(false);

  const { users, products, videos, posts, requests } = store;
  const buyers = users.filter((u) => u.role === 'buyer').length;
  const artisans = users.filter((u) => u.role === 'artisan').length;

  const tabs = [
    { key: 'overview', label: t('dash.overview'), icon: LayoutDashboard },
    { key: 'users', label: t('admin.users'), icon: Users },
    { key: 'products', label: t('admin.products'), icon: Package },
    { key: 'learning', label: t('admin.learning'), icon: PlayCircle },
    { key: 'community', label: t('admin.community'), icon: MessagesSquare },
  ];

  const doConfirm = () => {
    const { kind, item } = confirm;
    if (kind === 'user') { store.removeUser(item.id); toast.success(t('toast.userRemoved')); }
    if (kind === 'product') { store.removeProduct(item.id); toast.success(t('toast.productDeleted')); }
    if (kind === 'video') { store.removeVideo(item.id); toast.success(t('toast.videoRemoved')); }
    if (kind === 'post') { store.removePost(item.id); toast.success(t('toast.postDeleted')); }
    if (kind === 'reset') { store.resetDemo(); toast.success(t('admin.resetDone')); }
    setConfirm(null);
  };

  const confirmText = confirm && {
    user: [t('admin.removeUserTitle'), t('admin.removeUserText', { name: confirm.item?.name })],
    product: [t('product.deleteTitle'), t('product.deleteText', { name: confirm.item ? tr(confirm.item, 'name') : '' })],
    video: [t('admin.removeVideoTitle'), t('admin.removeVideoText', { name: confirm.item ? tr(confirm.item, 'title') : '' })],
    post: [t('community.deleteTitle'), t('community.deleteText')],
    reset: [t('admin.resetTitle'), t('admin.resetText')],
  }[confirm.kind];

  const toggleBlock = (u) => {
    store.updateUser(u.id, { blocked: !u.blocked });
    toast.success(u.blocked ? t('toast.userUnblocked', { name: u.name }) : t('toast.userBlocked', { name: u.name }));
  };

  const filteredUsers = users.filter((u) => !q.trim() || [u.name, u.phone, u.role].join(' ').toLowerCase().includes(q.trim().toLowerCase()));
  const maxCat = Math.max(1, ...categories.map((c) => products.filter((p) => p.category === c.key).length));

  return (
    <div className="container-x py-8">
      <div className="mb-6">
        <h1 className="text-3xl">{t('admin.title')}</h1>
        <p className="text-charcoal-600">{t('admin.subtitle')}</p>
      </div>
      <Tabs tabs={tabs} value={tab} onChange={(k) => { setTab(k); setQ(''); }} />

      <div className="mt-6">
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label={t('admin.statUsers', { a: artisans, b: buyers })} value={users.length} />
              <StatCard icon={Package} label={t('dash.statProducts')} value={products.length} tone="olive" />
              <StatCard icon={Inbox} label={t('admin.statRequests')} value={requests.length} tone="gold" />
              <StatCard icon={MessagesSquare} label={t('admin.statPosts')} value={posts.length} tone="charcoal" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="card p-6">
                <h2 className="mb-4 text-xl">{t('admin.byCategory')}</h2>
                <ul className="space-y-3">
                  {categories.map((c) => {
                    const n = products.filter((p) => p.category === c.key).length;
                    return (
                      <li key={c.key}>
                        <div className="mb-1 flex justify-between text-sm"><span>{label(categories, c.key)}</span><span className="font-semibold">{n}</span></div>
                        <div className="h-3 overflow-hidden rounded-full bg-sandstone-100"><div className="h-full rounded-full bg-terracotta-500" style={{ width: `${(n / maxCat) * 100}%` }} /></div>
                      </li>
                    );
                  })}
                </ul>
              </section>
              <section className="card p-6">
                <h2 className="mb-4 text-xl">{t('admin.recentUsers')}</h2>
                <ul className="divide-y divide-sandstone-100">
                  {[...users].filter((u) => u.role !== 'admin').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((u) => (
                    <li key={u.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0"><p className="truncate font-semibold">{u.name}</p><p className="text-sm text-charcoal-500">{formatDate(u.createdAt, lang)}</p></div>
                      <RoleBadge role={u.role} />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <div className="rounded-xl2 border-2 border-dashed border-sandstone-300 p-5">
              <p className="font-semibold">{t('admin.demoData')}</p>
              <p className="mb-3 text-sm text-charcoal-600">{t('admin.demoDataText')}</p>
              <button className="btn btn-soft btn-sm" onClick={() => setConfirm({ kind: 'reset' })}><RotateCcw className="h-4 w-4" aria-hidden /> {t('admin.reset')}</button>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400" aria-hidden />
              <input type="search" className="input pl-12" placeholder={t('admin.searchUsers')} aria-label={t('search')} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            {filteredUsers.length === 0 ? <EmptyState icon={Users} title={t('admin.noUsers')} /> : (
              <ul className="space-y-3">
                {filteredUsers.map((u) => (
                  <li key={u.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 font-semibold">{u.name} <RoleBadge role={u.role} />{u.blocked && <span className="badge bg-red-100 text-red-800">{t('admin.blocked')}</span>}</p>
                      <p className="text-sm text-charcoal-600">+91 {u.phone} · {t('admin.joined', { date: formatDate(u.createdAt, lang) })}</p>
                    </div>
                    {u.role !== 'admin' && u.id !== user.id && (
                      <div className="flex flex-wrap gap-2">
                        {u.role === 'artisan' && <Link to={`/artisans/${u.id}`} className="btn btn-soft btn-sm"><Eye className="h-4 w-4" aria-hidden /> {t('view')}</Link>}
                        <button className="btn btn-soft btn-sm" onClick={() => toggleBlock(u)}>{u.blocked ? <><UserCheck className="h-4 w-4" aria-hidden /> {t('admin.unblock')}</> : <><Ban className="h-4 w-4" aria-hidden /> {t('admin.block')}</>}</button>
                        <button className="btn btn-soft btn-sm !text-red-700" onClick={() => setConfirm({ kind: 'user', item: u })}><Trash2 className="h-4 w-4" aria-hidden /> {t('delete')}</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === 'products' && (
          <ul className="space-y-3">
            {products.map((p) => {
              const a = store.getArtisan(p.artisanId);
              return (
                <li key={p.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{tr(p, 'name')} {p.featured && <span className="badge ml-1 bg-gold-300/60 text-sandstone-900"><Star className="h-3 w-3" aria-hidden /> {t('admin.featured')}</span>}</p>
                    <p className="text-sm text-charcoal-600">{label(categories, p.category)} · {formatPrice(p.price)} · {a ? tr(a, 'name') : '—'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/crafts/${p.id}`} className="btn btn-soft btn-sm"><Eye className="h-4 w-4" aria-hidden /> {t('view')}</Link>
                    <button className="btn btn-soft btn-sm" onClick={() => { store.updateProduct(p.id, { featured: !p.featured }); toast.success(p.featured ? t('toast.unfeatured') : t('toast.featured')); }}><Star className="h-4 w-4" aria-hidden /> {p.featured ? t('admin.unfeature') : t('admin.feature')}</button>
                    <button className="btn btn-soft btn-sm !text-red-700" onClick={() => setConfirm({ kind: 'product', item: p })}><Trash2 className="h-4 w-4" aria-hidden /> {t('delete')}</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {tab === 'learning' && (
          <div className="space-y-4">
            <button className="btn btn-primary btn-sm" onClick={() => setVideoModal(true)}><Plus className="h-5 w-5" aria-hidden /> {t('admin.addVideo')}</button>
            <ul className="space-y-3">
              {videos.map((v) => (
                <li key={v.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{tr(v, 'title')}</p>
                    <p className="text-sm text-charcoal-600">{label(learningCategories, v.category)} · {t(`level.${v.level}`)} · {t('learn.minutes', { n: v.minutes })} · {v.teacher}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/learn?v=${v.id}`} className="btn btn-soft btn-sm"><PlayCircle className="h-4 w-4" aria-hidden /> {t('learn.play')}</Link>
                    <button className="btn btn-soft btn-sm !text-red-700" onClick={() => setConfirm({ kind: 'video', item: v })}><Trash2 className="h-4 w-4" aria-hidden /> {t('delete')}</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'community' && (
          posts.length === 0 ? <EmptyState icon={MessagesSquare} title={t('community.emptyTitle')} /> : (
            <ul className="space-y-3">
              {posts.map((p) => {
                const a = store.getUser(p.authorId);
                return (
                  <li key={p.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-charcoal-500">{a?.name || t('community.removedUser')} · {timeAgo(p.createdAt, lang)} · {t(`tag.${p.tag}`)} · {p.likes.length} ♥ · {p.comments.length} {t('community.comments')}</p>
                      <p className="mt-1 line-clamp-3">{p.text}</p>
                      {p.comments.length > 0 && (
                        <ul className="mt-3 space-y-1.5 border-l-2 border-sandstone-200 pl-3 text-sm">
                          {p.comments.map((c) => (
                            <li key={c.id} className="flex items-start justify-between gap-2">
                              <span><strong>{store.getUser(c.authorId)?.name || '—'}:</strong> {c.text}</span>
                              <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-charcoal-400 hover:bg-red-50 hover:text-red-700" onClick={() => { store.removeComment(p.id, c.id); toast.success(t('toast.commentDeleted')); }} aria-label={t('delete')}><Trash2 className="h-4 w-4" /></button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button className="btn btn-soft btn-sm !text-red-700" onClick={() => setConfirm({ kind: 'post', item: p })}><Trash2 className="h-4 w-4" aria-hidden /> {t('delete')}</button>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </div>

      <VideoForm open={videoModal} onClose={() => setVideoModal(false)} onSave={(v) => { store.addVideo(v); toast.success(t('toast.videoAdded')); setVideoModal(false); }} />
      <ConfirmDialog open={!!confirm} onCancel={() => setConfirm(null)} onConfirm={doConfirm} title={confirmText?.[0]} message={confirmText?.[1]} confirmLabel={confirm?.kind === 'reset' ? t('admin.reset') : t('delete')} />
    </div>
  );
}

function VideoForm({ open, onClose, onSave }) {
  const { t, label } = useLang();
  const empty = { title: '', title_te: '', category: 'basics', level: 'beginner', minutes: '', teacher: '', src: '', summary: '', step1: '', step2: '', step3: '' };
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (f.title.trim().length < 5) err.title = t('err.videoTitle');
    if (!Number(f.minutes) || Number(f.minutes) < 1) err.minutes = t('err.videoMinutes');
    if (!f.teacher.trim()) err.teacher = t('err.videoTeacher');
    if (!/^https?:\/\/.+/i.test(f.src.trim())) err.src = t('err.videoSrc');
    if (f.summary.trim().length < 10) err.summary = t('err.videoSummary');
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({ title: f.title.trim(), title_te: f.title_te.trim(), category: f.category, level: f.level, minutes: Number(f.minutes), teacher: f.teacher.trim(), src: f.src.trim(), summary: f.summary.trim(), steps: [f.step1, f.step2, f.step3].map((s) => s.trim()).filter(Boolean) });
    setF(empty);
  };

  return (
    <Modal open={open} onClose={onClose} wide title={t('admin.addVideo')} footer={<><button type="button" className="btn btn-soft" onClick={onClose}>{t('cancel')}</button><button type="submit" form="video-form" className="btn btn-primary"><Plus className="h-5 w-5" aria-hidden /> {t('admin.publishVideo')}</button></>}>
      <form id="video-form" onSubmit={submit} className="space-y-5" noValidate>
        <FormField id="vf-title" label={t('admin.videoTitle')} error={errors.title}><input id="vf-title" className={`input ${errors.title ? 'input-error' : ''}`} value={f.title} onChange={set('title')} /></FormField>
        <FormField id="vf-title-te" label={t('admin.videoTitleTe')} optional optionalLabel={t('optional')}><input id="vf-title-te" lang="te" className="input" value={f.title_te} onChange={set('title_te')} /></FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="vf-cat" label={t('field.category')}><select id="vf-cat" className="input" value={f.category} onChange={set('category')}>{learningCategories.map((c) => <option key={c.key} value={c.key}>{label(learningCategories, c.key)}</option>)}</select></FormField>
          <FormField id="vf-level" label={t('learn.level')}><select id="vf-level" className="input" value={f.level} onChange={set('level')}>{['beginner', 'intermediate', 'advanced'].map((l) => <option key={l} value={l}>{t(`level.${l}`)}</option>)}</select></FormField>
          <FormField id="vf-min" label={t('admin.videoMinutes')} error={errors.minutes}><input id="vf-min" type="number" min="1" className={`input ${errors.minutes ? 'input-error' : ''}`} value={f.minutes} onChange={set('minutes')} /></FormField>
          <FormField id="vf-teacher" label={t('admin.videoTeacher')} error={errors.teacher}><input id="vf-teacher" className={`input ${errors.teacher ? 'input-error' : ''}`} value={f.teacher} onChange={set('teacher')} /></FormField>
        </div>
        <FormField id="vf-src" label={t('admin.videoSrc')} error={errors.src} hint={t('admin.videoSrcHint')}><input id="vf-src" type="url" inputMode="url" className={`input ${errors.src ? 'input-error' : ''}`} value={f.src} onChange={set('src')} /></FormField>
        <FormField id="vf-sum" label={t('admin.videoSummary')} error={errors.summary}><textarea id="vf-sum" rows={2} className={`input ${errors.summary ? 'input-error' : ''}`} value={f.summary} onChange={set('summary')} /></FormField>
        <fieldset className="space-y-3"><legend className="label">{t('admin.videoSteps')}</legend>
          {['step1', 'step2', 'step3'].map((k, i) => <input key={k} className="input" aria-label={`${t('admin.videoStep')} ${i + 1}`} placeholder={`${t('admin.videoStep')} ${i + 1}`} value={f[k]} onChange={set(k)} />)}
        </fieldset>
      </form>
    </Modal>
  );
}
