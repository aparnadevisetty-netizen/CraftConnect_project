import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import { Avatar, RoleBadge } from './ui.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { timeAgo } from '../utils/format.js';

export default function PostCard({ post, compact = false }) {
  const { getUser, getArtisan, toggleLike, addComment, removePost, removeComment } = useStore();
  const { user, role } = useAuth();
  const toast = useToast();
  const { t, tr, lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [confirm, setConfirm] = useState(false);

  const author = getUser(post.authorId);
  const artisan = getArtisan(post.authorId);
  const liked = user && post.likes.includes(user.id);
  const canDelete = user && (user.id === post.authorId || role === 'admin');

  const needLogin = () => {
    toast.info(t('toast.loginToInteract'));
    navigate('/login', { state: { from: location.pathname } });
  };
  const like = () => (user ? toggleLike(post.id, user.id) : needLogin());
  const send = (e) => {
    e.preventDefault();
    if (!user) return needLogin();
    if (comment.trim().length < 2) return toast.error(t('err.commentShort'));
    addComment(post.id, { authorId: user.id, text: comment.trim() });
    setComment('');
  };

  return (
    <article className="card overflow-hidden">
      <div className="flex items-center gap-3 p-5 pb-3">
        <Avatar name={author?.name || '?'} tone={author?.role === 'artisan' ? 'terracotta' : 'olive'} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {artisan ? <Link to={`/artisans/${artisan.id}`} className="hover:underline">{author.name}</Link> : author?.name || t('community.removedUser')}
            {author && <RoleBadge role={author.role} />}
          </p>
          <p className="text-sm text-charcoal-500">{timeAgo(post.createdAt, lang)} · {t(`tag.${post.tag}`)}</p>
        </div>
        {canDelete && !compact && (
          <button onClick={() => setConfirm(true)} className="grid h-11 w-11 place-items-center rounded-full text-charcoal-500 hover:bg-red-50 hover:text-red-700" aria-label={t('delete')}><Trash2 className="h-5 w-5" /></button>
        )}
      </div>
      <p className={`px-5 pb-4 text-[16px] ${compact ? 'line-clamp-3' : ''}`}>{tr(post, 'text')}</p>
      {/* Images hidden — text-only posts per design decision */}
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={like} aria-pressed={!!liked} className={`inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 font-semibold transition hover:bg-sandstone-100 ${liked ? 'text-terracotta-700' : 'text-charcoal-700'}`}>
          <Heart className="h-6 w-6" fill={liked ? 'currentColor' : 'none'} aria-hidden /> {post.likes.length} <span className="sr-only">{t('community.likes')}</span>
        </button>
        {!compact && (
          <button onClick={() => setShowComments((v) => !v)} aria-expanded={showComments} className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 font-semibold text-charcoal-700 transition hover:bg-sandstone-100">
            <MessageCircle className="h-6 w-6" aria-hidden /> {post.comments.length} <span className="hidden sm:inline">{t('community.comments')}</span>
          </button>
        )}
      </div>
      {showComments && !compact && (
        <div className="border-t border-sandstone-100 bg-sandstone-50 p-5">
          {post.comments.length === 0 && <p className="mb-3 text-charcoal-500">{t('community.noComments')}</p>}
          <ul className="space-y-3">
            {post.comments.map((c) => {
              const ca = getUser(c.authorId);
              const mine = user && (user.id === c.authorId || role === 'admin');
              return (
                <li key={c.id} className="flex gap-3">
                  <Avatar name={ca?.name || '?'} size="sm" tone={ca?.role === 'artisan' ? 'terracotta' : 'olive'} />
                  <div className="min-w-0 flex-1 rounded-2xl bg-white px-4 py-2.5">
                    <p className="text-sm font-semibold">{ca?.name || t('community.removedUser')} <span className="font-normal text-charcoal-500">· {timeAgo(c.createdAt, lang)}</span></p>
                    <p>{tr(c, 'text')}</p>
                  </div>
                  {mine && <button onClick={() => removeComment(post.id, c.id)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-charcoal-400 hover:bg-red-50 hover:text-red-700" aria-label={t('delete')}><Trash2 className="h-4 w-4" /></button>}
                </li>
              );
            })}
          </ul>
          <form onSubmit={send} className="mt-4 flex gap-2">
            <input className="input" placeholder={t('community.writeComment')} value={comment} onChange={(e) => setComment(e.target.value)} aria-label={t('community.writeComment')} />
            <button className="btn btn-primary shrink-0 px-5" aria-label={t('send')}><Send className="h-5 w-5" aria-hidden /></button>
          </form>
        </div>
      )}
      <ConfirmDialog
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={() => { removePost(post.id); setConfirm(false); toast.success(t('toast.postDeleted')); }}
        title={t('community.deleteTitle')}
        message={t('community.deleteText')}
        confirmLabel={t('delete')}
      />
    </article>
  );
}
