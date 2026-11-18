import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Info } from 'lucide-react';
import { useAuth, homeFor } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import FormField from '../components/FormField.jsx';
import AuthShell from '../components/AuthShell.jsx';
import { isValidPhone } from '../utils/format.js';

const DEMOS = [
  { key: 'artisan', phone: '9000000001', password: 'craft123' },
  { key: 'buyer', phone: '9000000011', password: 'buyer123' },
  { key: 'admin', phone: '9000000099', password: 'admin123' },
];

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [form, setForm] = useState({ phone: '', password: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});

  if (user) return <Navigate to={from && from !== '/login' ? from : homeFor(user.role)} replace />;

  const attempt = (phone, password) => {
    const res = login(phone, password);
    if (!res.ok) {
      const msg = t(`err.login.${res.error}`);
      setErrors({ form: msg });
      toast.error(msg);
      return;
    }
    toast.success(t('toast.welcome', { name: res.user.name.split(' ')[0] }));
    const home = homeFor(res.user.role);
    navigate(from && from !== '/login' && !(from.startsWith('/artisan') || from.startsWith('/buyer') || from.startsWith('/admin')) ? from : home, { replace: true });
  };

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!isValidPhone(form.phone)) err.phone = t('err.phone');
    if (!form.password) err.password = t('err.passwordMissing');
    setErrors(err);
    if (Object.keys(err).length) return;
    attempt(form.phone, form.password);
  };

  return (
    <AuthShell title={t('login.title')} subtitle={t('login.subtitle')}>
      {location.state?.needed && (
        <p className="mb-5 flex items-start gap-3 rounded-xl bg-sandstone-100 p-4"><Info className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-700" aria-hidden /> {t('login.needed')}</p>
      )}
      <form onSubmit={submit} className="space-y-5" noValidate>
        {errors.form && <p className="error-text rounded-xl bg-red-50 p-3" role="alert">{errors.form}</p>}
        <FormField id="li-phone" label={t('field.phone')} error={errors.phone} hint={t('field.phoneHint')}>
          <input id="li-phone" inputMode="numeric" autoComplete="tel" className={`input ${errors.phone ? 'input-error' : ''}`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </FormField>
        <FormField id="li-pass" label={t('field.password')} error={errors.password}>
          <div className="relative">
            <input id="li-pass" type={show ? 'text' : 'password'} autoComplete="current-password" className={`input pr-14 ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-charcoal-500 hover:bg-sandstone-100" aria-label={show ? t('field.hidePassword') : t('field.showPassword')}>
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </FormField>
        <button className="btn btn-primary w-full text-lg"><LogIn className="h-5 w-5" aria-hidden /> {t('nav.login')}</button>
      </form>
      <p className="mt-6 text-center text-charcoal-700">{t('login.noAccount')} <Link to="/register" state={{ from }} className="font-semibold text-terracotta-700 hover:underline">{t('nav.register')}</Link></p>

      <div className="mt-8 rounded-xl2 border-2 border-dashed border-sandstone-300 p-4">
        <p className="font-semibold">{t('login.demoTitle')}</p>
        <p className="mb-3 text-sm text-charcoal-600">{t('login.demoText')}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {DEMOS.map((d) => <button key={d.key} type="button" className="btn btn-soft btn-sm" onClick={() => attempt(d.phone, d.password)}>{t(`role.${d.key}`)}</button>)}
        </div>
      </div>
    </AuthShell>
  );
}
