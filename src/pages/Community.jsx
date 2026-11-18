import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus, Send, X, Loader2, MessagesSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import PostCard from '../components/PostCard.jsx';
import { Avatar, PageHeader, Tabs, EmptyState } from '../components/ui.jsx';
import { compressImage } from '../utils/format.js';

const TAGS = ['showcase', 'tips', 'question'];

export default function Community() {
  const { posts, addPost } = useStore();
  const { user } = useAuth();
  const toast = useToast();
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const [text, setText] = useState('');
  const [tag, setTag] = useState('showcase');
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const file = useRef(null);

  const list = filter === 'all' ? posts : posts.filter((p) => p.tag === filter);

  const pick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true);
    try { setImage(await compressImage(f)); } catch { toast.error(t('upload.notImage', { name: f.name })); }
    setBusy(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (text.trim().length < 5) return setError(t('err.postShort'));
    addPost({ authorId: user.id, text: text.trim(), tag, image });
    setText(''); setImage(null); setError('');
    toast.success(t('toast.postShared'));
  };

  const tabs = [{ key: 'all', label: t('all') }, ...TAGS.map((k) => ({ key: k, label: t(`tag.${k}`) }))];

  return (
    <>
      <PageHeader title={t('community.title')} subtitle={t('community.subtitle')} />
      <div className="container-x py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {user ? (
            <form onSubmit={submit} className="card p-5" noValidate>
              <div className="flex gap-3">
                <Avatar name={user.name} tone={user.role === 'artisan' ? 'terracotta' : 'olive'} />
                <div className="flex-1">
                  <label htmlFor="post-text" className="sr-only">{t('community.shareLabel')}</label>
                  <textarea id="post-text" rows={3} className={`input ${error ? 'input-error' : ''}`} placeholder={t('community.sharePlaceholder', { name: user.name.split(' ')[0] })} value={text} onChange={(e) => { setText(e.target.value); setError(''); }} />
                  {error && <p className="error-text" role="alert">{error}</p>}
                  {image && (
                    <div className="relative mt-3 inline-block">
                      <img src={image} alt={t('upload.photo')} className="h-32 rounded-xl border border-sandstone-200 object-cover" />
                      <button type="button" onClick={() => setImage(null)} className="absolute right-1.5 top-1.5 grid h-10 w-10 place-items-center rounded-full bg-charcoal-900/80 text-ivory" aria-label={t('upload.remove')}><X className="h-5 w-5" /></button>
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={t('community.topic')}>
                    {TAGS.map((k) => <button type="button" key={k} onClick={() => setTag(k)} aria-pressed={tag === k} className={`chip text-sm ${tag === k ? 'chip-active' : ''}`}>{t(`tag.${k}`)}</button>)}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button type="button" className="btn btn-soft btn-sm" onClick={() => file.current?.click()} disabled={busy}>
                      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" aria-hidden />} {t('community.addPhoto')}
                    </button>
                    <button type="submit" className="btn btn-primary"><Send className="h-5 w-5" aria-hidden /> {t('community.post')}</button>
                  </div>
                  <input ref={file} type="file" accept="image/*" className="hidden" onChange={pick} />
                </div>
              </div>
            </form>
          ) : (
            <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
              <p className="flex-1 text-lg">{t('community.guestNote')}</p>
              <div className="flex gap-3">
                <Link to="/login" state={{ from: '/community' }} className="btn btn-primary btn-sm">{t('nav.login')}</Link>
                <Link to="/register" state={{ from: '/community' }} className="btn btn-soft btn-sm">{t('nav.register')}</Link>
              </div>
            </div>
          )}

          <Tabs tabs={tabs} value={filter} onChange={setFilter} />

          {list.length ? list.map((p) => <PostCard key={p.id} post={p} />) : <EmptyState icon={MessagesSquare} title={t('community.emptyTitle')} text={t('community.emptyText')} />}
        </div>
      </div>
    </>
  );
}
