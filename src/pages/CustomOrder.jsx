import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Send, CheckCircle2, Info, LogIn } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { specialties } from '../data/artisans.js';
import FormField from '../components/FormField.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import { PageHeader } from '../components/ui.jsx';
import { isValidPhone, cleanPhone } from '../utils/format.js';

const DRAFT_KEY = 'craftconnect:custom-draft';
const BUDGETS = ['b1', 'b2', 'b3', 'b4', 'b5'];
const STONES = ['any', 'grey', 'sage', 'sand'];
const BUDGET_TEXT = { b1: 'Under ₹3,000', b2: '₹3,000 – ₹6,000', b3: '₹6,000 – ₹15,000', b4: '₹15,000 – ₹50,000', b5: 'Above ₹50,000' };

const loadDraft = () => { try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY)) || null; } catch { return null; } };

export default function CustomOrder() {
  const { artisans, products, addRequest } = useStore();
  const { user, role } = useAuth();
  const toast = useToast();
  const { t, tr, label } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const refProduct = products.find((p) => p.id === params.get('ref'));
  const [form, setForm] = useState(() => ({
    craft: refProduct?.category || 'decor',
    title: refProduct ? t('custom.titleFrom', { name: tr(refProduct, 'name') }) : '',
    description: '',
    size: '',
    quantity: 1,
    stone: 'any',
    budget: 'b2',
    deadline: '',
    artisanId: params.get('artisan') || 'any',
    phone: '',
    ...(loadDraft() || {}),
  }));
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (user && !form.phone) setForm((f) => ({ ...f, phone: user.phone }));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch { /* ignore */ }
  }, [form]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const today = new Date().toISOString().slice(0, 10);

  const validate = () => {
    const err = {};
    if (form.title.trim().length < 5) err.title = t('err.customTitle');
    if (form.description.trim().length < 20) err.description = t('err.customDescription');
    if (!Number(form.quantity) || Number(form.quantity) < 1) err.quantity = t('err.quantity');
    if (form.deadline && form.deadline < today) err.deadline = t('err.deadlinePast');
    if (!isValidPhone(form.phone)) err.phone = t('err.phone');
    setErrors(err);
    if (Object.keys(err).length) {
      toast.error(t('err.fixHighlighted'));
      setTimeout(() => document.querySelector('[role="alert"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
    }
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user) {
      toast.info(t('custom.loginFirst'));
      return navigate('/login', { state: { from: '/custom-order', needed: true } });
    }
    if (role !== 'buyer') return toast.error(t('custom.buyersOnly'));
    const req = addRequest({
      type: 'custom',
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: cleanPhone(form.phone),
      artisanId: form.artisanId === 'any' ? null : form.artisanId,
      productId: null,
      title: form.title.trim(),
      quantity: Number(form.quantity),
      message: form.description.trim(),
      details: {
        craft: label(specialties, form.craft) || form.craft,
        size: form.size.trim(),
        stone: t(`stone.${form.stone}`),
        budget: BUDGET_TEXT[form.budget],
        deadline: form.deadline,
      },
      images,
    });
    try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setDone(req);
    toast.success(t('toast.customSent'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (done) {
    return (
      <>
        <PageHeader title={t('custom.title')} />
        <div className="container-x py-12">
          <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-olive-100 text-olive-700"><CheckCircle2 className="h-10 w-10" aria-hidden /></span>
            <h2 className="mt-5 text-3xl">{t('custom.doneTitle')}</h2>
            <p className="mt-3 text-lg text-charcoal-700">{t('custom.doneText')}</p>
            <p className="mt-4 inline-block rounded-full bg-sandstone-100 px-5 py-2 font-semibold">{t('custom.ref')}: {done.id.slice(-6).toUpperCase()}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/buyer" className="btn btn-primary">{t('enquiry.track')}</Link>
              <Link to="/explore" className="btn btn-soft">{t('nav.explore')}</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const section = (title, hint, children) => (
    <fieldset className="card space-y-5 p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <div><h2 className="text-2xl">{title}</h2>{hint && <p className="mt-1 text-charcoal-600">{hint}</p>}</div>
      {children}
    </fieldset>
  );

  return (
    <>
      <PageHeader title={t('custom.title')} subtitle={t('custom.subtitle')} />
      <div className="container-x py-10">
        <div className="mx-auto max-w-3xl">
          {!user && (
            <div className="mb-6 flex flex-col gap-4 rounded-xl2 bg-sandstone-100 p-5 sm:flex-row sm:items-center">
              <Info className="h-7 w-7 shrink-0 text-terracotta-700" aria-hidden />
              <p className="flex-1 text-[16px]">{t('custom.guestNote')}</p>
              <Link to="/login" state={{ from: '/custom-order' }} className="btn btn-primary btn-sm shrink-0"><LogIn className="h-4 w-4" aria-hidden /> {t('nav.login')}</Link>
            </div>
          )}
          {role === 'artisan' || role === 'admin' ? (
            <div className="card p-8 text-center"><p className="text-lg">{t('custom.buyersOnly')}</p></div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-6">
              {section(t('custom.s1'), t('custom.s1h'), (
                <>
                  <FormField id="co-craft" label={t('custom.craftType')}>
                    <select id="co-craft" className="input" value={form.craft} onChange={set('craft')}>
                      {specialties.map((s) => <option key={s.key} value={s.key}>{label(specialties, s.key)}</option>)}
                    </select>
                  </FormField>
                  <FormField id="co-title" label={t('custom.what')} error={errors.title} hint={t('custom.whatHint')}>
                    <input id="co-title" className={`input ${errors.title ? 'input-error' : ''}`} value={form.title} onChange={set('title')} />
                  </FormField>
                  <FormField id="co-desc" label={t('custom.describe')} error={errors.description} hint={t('custom.describeHint')}>
                    <textarea id="co-desc" rows={5} className={`input ${errors.description ? 'input-error' : ''}`} value={form.description} onChange={set('description')} />
                  </FormField>
                </>
              ))}

              {section(t('custom.s2'), t('custom.s2h'), (
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="co-size" label={t('custom.size')} optional optionalLabel={t('optional')} hint={t('custom.sizeHint')}>
                    <input id="co-size" className="input" value={form.size} onChange={set('size')} />
                  </FormField>
                  <FormField id="co-qty" label={t('field.quantity')} error={errors.quantity}>
                    <input id="co-qty" type="number" min="1" className={`input ${errors.quantity ? 'input-error' : ''}`} value={form.quantity} onChange={set('quantity')} />
                  </FormField>
                  <FormField id="co-stone" label={t('custom.stone')}>
                    <select id="co-stone" className="input" value={form.stone} onChange={set('stone')}>
                      {STONES.map((s) => <option key={s} value={s}>{t(`stone.${s}`)}</option>)}
                    </select>
                  </FormField>
                  <FormField id="co-budget" label={t('custom.budget')}>
                    <select id="co-budget" className="input" value={form.budget} onChange={set('budget')}>
                      {BUDGETS.map((b) => <option key={b} value={b}>{BUDGET_TEXT[b]}</option>)}
                    </select>
                  </FormField>
                  <FormField id="co-deadline" label={t('custom.deadline')} error={errors.deadline} optional optionalLabel={t('optional')}>
                    <input id="co-deadline" type="date" min={today} className={`input ${errors.deadline ? 'input-error' : ''}`} value={form.deadline} onChange={set('deadline')} />
                  </FormField>
                </div>
              ))}

              {section(t('custom.s3'), t('custom.s3h'), <ImageUploader value={images} onChange={setImages} max={4} label={t('custom.refPhoto')} />)}

              {section(t('custom.s4'), t('custom.s4h'), (
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="co-artisan" label={t('custom.artisan')}>
                    <select id="co-artisan" className="input" value={form.artisanId} onChange={set('artisanId')}>
                      <option value="any">{t('custom.anyArtisan')}</option>
                      {artisans.map((a) => <option key={a.id} value={a.id}>{tr(a, 'name')} — {a.village}</option>)}
                    </select>
                  </FormField>
                  <FormField id="co-phone" label={t('field.phone')} error={errors.phone} hint={t('field.phoneHint')}>
                    <input id="co-phone" inputMode="numeric" autoComplete="tel" className={`input ${errors.phone ? 'input-error' : ''}`} value={form.phone} onChange={set('phone')} />
                  </FormField>
                </div>
              ))}

              <button type="submit" className="btn btn-primary w-full text-lg sm:w-auto sm:px-10"><Send className="h-5 w-5" aria-hidden /> {t('custom.submit')}</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
