import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Hammer, ShoppingBag, UserPlus, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth, homeFor } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { specialties, villages } from '../data/artisans.js';
import FormField from '../components/FormField.jsx';
import AuthShell from '../components/AuthShell.jsx';
import { isValidPhone } from '../utils/format.js';

export default function Register() {
  const { user, register } = useAuth();
  const toast = useToast();
  const { t, label } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const from = location.state?.from;
  const [role, setRole] = useState(params.get('role') === 'artisan' ? 'artisan' : 'buyer');
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirm: '', village: 'Durgi', experience: '', city: '', specialties: [] });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleSpecialty = (k) => setForm((f) => ({ ...f, specialties: f.specialties.includes(k) ? f.specialties.filter((x) => x !== k) : [...f.specialties, k] }));

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (form.name.trim().length < 3) err.name = t('err.name');
    if (!isValidPhone(form.phone)) err.phone = t('err.phone');
    if (form.password.length < 6) err.password = t('err.passwordShort');
    if (form.confirm !== form.password) err.confirm = t('err.passwordMatch');
    if (role === 'artisan' && form.experience !== '' && (Number(form.experience) < 0 || Number(form.experience) > 70)) err.experience = t('err.experience');
    setErrors(err);
    if (Object.keys(err).length) return toast.error(t('err.fixHighlighted'));
    const res = register({ ...form, role });
    if (!res.ok) {
      setErrors({ phone: t(`err.register.${res.error}`) });
      return toast.error(t(`err.register.${res.error}`));
    }
    toast.success(t('toast.registered', { name: form.name.split(' ')[0] }));
    navigate(role === 'artisan' ? '/artisan' : from && from !== '/register' ? from : '/buyer', { replace: true });
  };

  const roleCard = (key, Icon, title, text) => (
    <button
      type="button"
      onClick={() => setRole(key)}
      aria-pressed={role === key}
      className={`relative flex min-h-[132px] flex-col items-start gap-2 rounded-xl2 border-2 p-5 text-left transition ${role === key ? 'border-terracotta-600 bg-terracotta-50' : 'border-sandstone-200 bg-white hover:border-terracotta-300'}`}
    >
      {role === key && <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-terracotta-600 text-ivory"><Check className="h-4 w-4" /></span>}
      <Icon className="h-8 w-8 text-terracotta-600" aria-hidden />
      <span className="text-lg font-semibold">{title}</span>
      <span className="text-sm text-charcoal-600">{text}</span>
    </button>
  );

  return (
    <AuthShell title={t('register.title')} subtitle={t('register.subtitle')} wide>
      <form onSubmit={submit} className="space-y-6" noValidate>
        <fieldset>
          <legend className="label">{t('register.iAm')}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {roleCard('artisan', Hammer, t('register.asArtisan'), t('register.artisanText'))}
            {roleCard('buyer', ShoppingBag, t('register.asBuyer'), t('register.buyerText'))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="rg-name" label={t('field.fullName')} error={errors.name}>
            <input id="rg-name" autoComplete="name" className={`input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={set('name')} />
          </FormField>
          <FormField id="rg-phone" label={t('field.phone')} error={errors.phone} hint={t('register.phoneHint')}>
            <input id="rg-phone" inputMode="numeric" autoComplete="tel" className={`input ${errors.phone ? 'input-error' : ''}`} value={form.phone} onChange={set('phone')} />
          </FormField>
          <FormField id="rg-pass" label={t('field.password')} error={errors.password} hint={t('register.passHint')}>
            <div className="relative">
              <input id="rg-pass" type={show ? 'text' : 'password'} autoComplete="new-password" className={`input pr-14 ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={set('password')} />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-charcoal-500 hover:bg-sandstone-100" aria-label={show ? t('field.hidePassword') : t('field.showPassword')}>
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </FormField>
          <FormField id="rg-confirm" label={t('field.confirmPassword')} error={errors.confirm}>
            <input id="rg-confirm" type={show ? 'text' : 'password'} autoComplete="new-password" className={`input ${errors.confirm ? 'input-error' : ''}`} value={form.confirm} onChange={set('confirm')} />
          </FormField>
        </div>

        {role === 'artisan' ? (
          <div className="space-y-5 rounded-xl2 bg-sandstone-50 p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="rg-village" label={t('field.village')}>
                <select id="rg-village" className="input" value={form.village} onChange={set('village')}>
                  {villages.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </FormField>
              <FormField id="rg-exp" label={t('field.experience')} error={errors.experience} optional optionalLabel={t('optional')}>
                <input id="rg-exp" type="number" min="0" max="70" inputMode="numeric" className={`input ${errors.experience ? 'input-error' : ''}`} value={form.experience} onChange={set('experience')} />
              </FormField>
            </div>
            <fieldset>
              <legend className="label">{t('register.whatYouMake')}</legend>
              <div className="flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <button type="button" key={s.key} onClick={() => toggleSpecialty(s.key)} aria-pressed={form.specialties.includes(s.key)} className={`chip ${form.specialties.includes(s.key) ? 'chip-active' : ''}`}>{label(specialties, s.key)}</button>
                ))}
              </div>
            </fieldset>
          </div>
        ) : (
          <FormField id="rg-city" label={t('field.city')} optional optionalLabel={t('optional')}>
            <input id="rg-city" autoComplete="address-level2" className="input" value={form.city} onChange={set('city')} />
          </FormField>
        )}

        <button className="btn btn-primary w-full text-lg"><UserPlus className="h-5 w-5" aria-hidden /> {t('register.submit')}</button>
        <p className="text-center text-charcoal-700">{t('register.haveAccount')} <Link to="/login" state={{ from }} className="font-semibold text-terracotta-700 hover:underline">{t('nav.login')}</Link></p>
      </form>
    </AuthShell>
  );
}
