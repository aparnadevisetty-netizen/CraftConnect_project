import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Send, IndianRupee, CheckCircle2, XCircle, Inbox, Hammer, Package, Calendar, Ruler, Wallet } from 'lucide-react';
import { StatusBadge, EmptyState } from './ui.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import FormField from './FormField.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { formatDate, formatPrice, timeAgo, whatsappLink, cleanPhone } from '../utils/format.js';

function RequestCard({ r, viewer }) {
  const { getArtisan, updateRequest } = useStore();
  const { user } = useAuth();
  const toast = useToast();
  const { t, lang } = useLang();
  const [panel, setPanel] = useState(null); // 'reply' | 'quote'
  const [text, setText] = useState('');
  const [quote, setQuote] = useState({ price: '', days: '' });
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null); // 'cancel' | 'decline' | 'close'

  const artisan = getArtisan(r.artisanId);
  const lastQuote = [...r.replies].reverse().find((x) => x.quote)?.quote;
  const contactPhone = viewer === 'artisan' ? r.buyerPhone : artisan?.phone;
  const contactName = viewer === 'artisan' ? r.buyerName : artisan?.name;
  const open = !['closed', 'cancelled', 'declined'].includes(r.status);

  const push = (reply, status) => {
    const claim = viewer === 'artisan' && !r.artisanId ? { artisanId: user.id } : {};
    updateRequest(r.id, { replies: [...r.replies, { ...reply, at: new Date().toISOString() }], ...(status ? { status } : {}), ...claim });
  };

  const sendReply = () => {
    if (text.trim().length < 2) return setError(t('err.replyShort'));
    push({ from: viewer, name: user.name, text: text.trim() }, viewer === 'artisan' && r.status === 'new' ? 'replied' : undefined);
    setText(''); setError(''); setPanel(null);
    toast.success(t('toast.replySent'));
  };

  const sendQuote = () => {
    const price = Number(quote.price), days = Number(quote.days);
    if (!price || price < 1) return setError(t('err.quotePrice'));
    if (!days || days < 1) return setError(t('err.quoteDays'));
    push({ from: 'artisan', name: user.name, text: text.trim() || t('request.quoteDefault'), quote: { price, days } }, 'quoted');
    setText(''); setQuote({ price: '', days: '' }); setError(''); setPanel(null);
    toast.success(t('toast.quoteSent'));
  };

  const accept = () => {
    push({ from: 'buyer', name: user.name, text: t('request.acceptedMsg') }, 'accepted');
    toast.success(t('toast.quoteAccepted'));
  };

  const doConfirm = () => {
    if (confirm === 'cancel') { push({ from: viewer, name: user.name, text: t('request.cancelledMsg') }, 'cancelled'); toast.success(t('toast.requestCancelled')); }
    if (confirm === 'decline') { push({ from: 'buyer', name: user.name, text: t('request.declinedMsg') }, 'declined'); toast.info(t('toast.quoteDeclined')); }
    if (confirm === 'close') { push({ from: 'artisan', name: user.name, text: t('request.closedMsg') }, 'closed'); toast.success(t('toast.requestClosed')); }
    setConfirm(null);
  };

  const d = r.details || {};
  const Detail = ({ icon: Icon, children }) => children ? <li className="flex items-start gap-2"><Icon className="mt-1 h-4 w-4 shrink-0 text-terracotta-600" aria-hidden /> <span>{children}</span></li> : null;

  return (
    <article className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-sandstone-100 bg-sandstone-50 px-5 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-olive-700">
            {r.type === 'custom' ? <Hammer className="h-4 w-4" aria-hidden /> : <Package className="h-4 w-4" aria-hidden />}
            {r.type === 'custom' ? t('request.custom') : t('request.product')}
            <span className="font-normal text-charcoal-500">· {timeAgo(r.createdAt, lang)}</span>
          </p>
          <h3 className="mt-1 text-xl leading-snug">
            {r.productId ? <Link to={`/crafts/${r.productId}`} className="hover:text-terracotta-700">{r.title}</Link> : r.title}
          </h3>
          <p className="mt-0.5 text-sm text-charcoal-600">
            {viewer === 'artisan' ? t('request.from', { name: r.buyerName }) : artisan ? t('request.to', { name: artisan.name }) : t('request.toAny')}
            {r.quantity > 1 && ` · ${t('field.quantity')}: ${r.quantity}`}
          </p>
        </div>
        <StatusBadge status={r.status} />
      </div>

      <div className="space-y-4 p-5">
        <p className="whitespace-pre-line text-[16px]">{r.message}</p>

        {r.type === 'custom' && (
          <ul className="grid gap-1.5 rounded-xl bg-sandstone-50 p-4 text-[15px] sm:grid-cols-2">
            <Detail icon={Hammer}>{d.craft}</Detail>
            <Detail icon={Ruler}>{d.size}</Detail>
            <Detail icon={Package}>{d.stone}</Detail>
            <Detail icon={Wallet}>{d.budget}</Detail>
            <Detail icon={Calendar}>{d.deadline && t('request.needBy', { date: formatDate(d.deadline, lang) })}</Detail>
          </ul>
        )}

        {r.images?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {r.images.map((src, i) => <img key={i} src={src} alt={`${t('upload.photo')} ${i + 1}`} loading="lazy" className="h-24 w-24 shrink-0 rounded-xl border border-sandstone-200 object-cover" />)}
          </div>
        )}

        {r.replies.length > 0 && (
          <ol className="space-y-3 border-l-2 border-sandstone-200 pl-4">
            {r.replies.map((x, i) => (
              <li key={i} className={`rounded-xl p-3.5 ${x.from === viewer ? 'bg-terracotta-50' : 'bg-olive-50'}`}>
                <p className="text-sm font-semibold">{x.name} <span className="font-normal text-charcoal-500">· {timeAgo(x.at, lang)}</span></p>
                <p className="mt-1 whitespace-pre-line">{x.text}</p>
                {x.quote && (
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-charcoal-900 shadow-soft">
                    <IndianRupee className="h-4 w-4 text-gold-600" aria-hidden /> {t('request.quoteLine', { price: formatPrice(x.quote.price), days: x.quote.days })}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}

        {/* Actions */}
        {panel && (
          <div className="space-y-3 rounded-xl bg-sandstone-50 p-4">
            {panel === 'quote' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id={`qp-${r.id}`} label={t('request.quotePrice')}>
                  <input id={`qp-${r.id}`} type="number" min="1" inputMode="numeric" className="input" value={quote.price} onChange={(e) => setQuote({ ...quote, price: e.target.value })} />
                </FormField>
                <FormField id={`qd-${r.id}`} label={t('request.quoteDays')}>
                  <input id={`qd-${r.id}`} type="number" min="1" inputMode="numeric" className="input" value={quote.days} onChange={(e) => setQuote({ ...quote, days: e.target.value })} />
                </FormField>
              </div>
            )}
            <FormField id={`rt-${r.id}`} label={panel === 'quote' ? t('request.quoteNote') : t('request.yourReply')} error={error} optional={panel === 'quote'} optionalLabel={t('optional')}>
              <textarea id={`rt-${r.id}`} rows={3} className={`input ${error && panel === 'reply' ? 'input-error' : ''}`} value={text} onChange={(e) => setText(e.target.value)} />
            </FormField>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button className="btn btn-soft btn-sm" onClick={() => { setPanel(null); setError(''); }}>{t('cancel')}</button>
              <button className="btn btn-primary btn-sm" onClick={panel === 'quote' ? sendQuote : sendReply}><Send className="h-4 w-4" aria-hidden /> {panel === 'quote' ? t('request.sendQuote') : t('request.sendReply')}</button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2.5">
          {open && !panel && <button className="btn btn-olive btn-sm" onClick={() => setPanel('reply')}><Send className="h-4 w-4" aria-hidden /> {t('request.reply')}</button>}
          {viewer === 'artisan' && open && !panel && r.type === 'custom' && (
            <button className="btn btn-soft btn-sm" onClick={() => setPanel('quote')}><IndianRupee className="h-4 w-4" aria-hidden /> {t('request.sendQuote')}</button>
          )}
          {viewer === 'buyer' && r.status === 'quoted' && lastQuote && (
            <>
              <button className="btn btn-primary btn-sm" onClick={accept}><CheckCircle2 className="h-4 w-4" aria-hidden /> {t('request.accept')}</button>
              <button className="btn btn-soft btn-sm" onClick={() => setConfirm('decline')}><XCircle className="h-4 w-4" aria-hidden /> {t('request.decline')}</button>
            </>
          )}
          {viewer === 'buyer' && ['new', 'replied'].includes(r.status) && (
            <button className="btn btn-soft btn-sm" onClick={() => setConfirm('cancel')}>{t('request.cancel')}</button>
          )}
          {viewer === 'artisan' && open && <button className="btn btn-soft btn-sm" onClick={() => setConfirm('close')}><CheckCircle2 className="h-4 w-4" aria-hidden /> {t('request.markDone')}</button>}
          {contactPhone && (
            <>
              <a className="btn btn-soft btn-sm" href={`tel:+91${cleanPhone(contactPhone)}`}><Phone className="h-4 w-4" aria-hidden /> {t('call')} {contactName?.split(' ')[0]}</a>
              <a className="btn btn-soft btn-sm" target="_blank" rel="noreferrer" href={whatsappLink(contactPhone, t('wa.requestHello', { title: r.title }))}><MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp</a>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={doConfirm}
        danger={confirm !== 'close'}
        title={t(`request.confirm.${confirm || 'cancel'}.title`)}
        message={t(`request.confirm.${confirm || 'cancel'}.text`)}
      />
    </article>
  );
}

export default function RequestList({ requests, viewer, emptyAction }) {
  const { t } = useLang();
  if (!requests.length) {
    return <EmptyState icon={Inbox} title={t(`request.empty.${viewer}.title`)} text={t(`request.empty.${viewer}.text`)} action={emptyAction} />;
  }
  return <div className="space-y-5">{requests.map((r) => <RequestCard key={r.id} r={r} viewer={viewer} />)}</div>;
}
