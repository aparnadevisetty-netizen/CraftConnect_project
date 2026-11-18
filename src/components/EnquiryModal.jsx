import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Send, LogIn, Info } from 'lucide-react';
import Modal from './Modal.jsx';
import FormField from './FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { isValidPhone, cleanPhone } from '../utils/format.js';

/** Direct buyer → artisan enquiry, either about one product or about the artisan in general. */
export default function EnquiryModal({ open, onClose, artisan, product }) {
  const { user, role } = useAuth();
  const { addRequest } = useStore();
  const toast = useToast();
  const { t, tr } = useLang();
  const location = useLocation();
  const [form, setForm] = useState({ phone: '', quantity: 1, message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ phone: user?.phone || '', quantity: 1, message: '' });
      setErrors({});
      setSent(false);
    }
  }, [open, user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const quick = product
    ? [t('enquiry.q1'), t('enquiry.q2'), t('enquiry.q3')]
    : [t('enquiry.q4'), t('enquiry.q5')];

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (form.message.trim().length < 10) err.message = t('err.messageShort');
    if (!isValidPhone(form.phone)) err.phone = t('err.phone');
    if (product && (!Number(form.quantity) || Number(form.quantity) < 1)) err.quantity = t('err.quantity');
    setErrors(err);
    if (Object.keys(err).length) return;
    addRequest({
      type: 'product',
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: cleanPhone(form.phone),
      artisanId: artisan.id,
      productId: product?.id || null,
      title: product ? tr(product, 'name') : t('enquiry.generalTitle'),
      quantity: product ? Number(form.quantity) : 1,
      message: form.message.trim(),
    });
    setSent(true);
    toast.success(t('toast.enquirySent'));
  };

  const title = product ? t('enquiry.titleProduct') : t('enquiry.titleArtisan', { name: tr(artisan, 'name') });

  // Not a buyer: explain what to do next instead of a dead end.
  if (open && role !== 'buyer') {
    return (
      <Modal open={open} onClose={onClose} title={title}>
        <div className="flex gap-4 rounded-xl2 bg-sandstone-100 p-5">
          <Info className="h-7 w-7 shrink-0 text-terracotta-700" aria-hidden />
          <div>
            <p className="text-lg font-semibold">{role === 'guest' ? t('enquiry.loginNeeded') : t('enquiry.buyersOnly')}</p>
            <p className="mt-1 text-charcoal-600">{role === 'guest' ? t('enquiry.loginWhy') : t('enquiry.buyersOnlyWhy')}</p>
          </div>
        </div>
        {role === 'guest' && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link to="/login" state={{ from: location.pathname }} className="btn btn-primary"><LogIn className="h-5 w-5" aria-hidden /> {t('nav.login')}</Link>
            <Link to="/register?role=buyer" state={{ from: location.pathname }} className="btn btn-soft">{t('register.asBuyer')}</Link>
          </div>
        )}
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={sent ? t('enquiry.sentTitle') : title}
      footer={
        sent ? (
          <>
            <button className="btn btn-soft" onClick={onClose}>{t('close')}</button>
            <Link to="/buyer" className="btn btn-primary">{t('enquiry.track')}</Link>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-soft" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" form="enquiry-form" className="btn btn-primary"><Send className="h-5 w-5" aria-hidden /> {t('enquiry.send')}</button>
          </>
        )
      }
    >
      {sent ? (
        <p className="text-lg">{t('enquiry.sentText', { name: tr(artisan, 'name') })}</p>
      ) : (
        <form id="enquiry-form" onSubmit={submit} className="space-y-5" noValidate>
          <p className="rounded-xl bg-white p-4 text-[15px] text-charcoal-600">{product ? t('enquiry.aboutProduct', { name: tr(product, 'name'), artisan: tr(artisan, 'name') }) : t('enquiry.aboutArtisan', { name: tr(artisan, 'name') })}</p>
          <FormField id="enq-message" label={t('enquiry.message')} error={errors.message} hint={t('enquiry.messageHint')}>
            <textarea id="enq-message" rows={4} className={`input ${errors.message ? 'input-error' : ''}`} value={form.message} onChange={set('message')} />
          </FormField>
          <div className="flex flex-wrap gap-2" aria-label={t('enquiry.quick')}>
            {quick.map((q) => (
              <button type="button" key={q} className="chip text-sm" onClick={() => setForm((f) => ({ ...f, message: f.message ? `${f.message} ${q}` : q }))}>{q}</button>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="enq-phone" label={t('field.phone')} error={errors.phone} hint={t('field.phoneHint')}>
              <input id="enq-phone" inputMode="numeric" autoComplete="tel" className={`input ${errors.phone ? 'input-error' : ''}`} value={form.phone} onChange={set('phone')} />
            </FormField>
            {product && (
              <FormField id="enq-qty" label={t('field.quantity')} error={errors.quantity}>
                <input id="enq-qty" type="number" min="1" className={`input ${errors.quantity ? 'input-error' : ''}`} value={form.quantity} onChange={set('quantity')} />
              </FormField>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
