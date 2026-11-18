import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import Modal from './Modal.jsx';
import FormField from './FormField.jsx';
import ImageUploader from './ImageUploader.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { categories } from '../data/products.js';

const EMPTY = { name: '', name_te: '', category: 'deities', price: '', size: '', weight: '', description: '', description_te: '', madeToOrder: false, leadDays: 0, photos: [] };
const TONE_BY_CATEGORY = { deities: 'slate', temple: 'sand', decor: 'sage', lamps: 'slate', utility: 'slate', gifts: 'terra' };
const ART_BY_CATEGORY = {
  deities: { kind: 'deity', variant: 'lakshmi' }, temple: { kind: 'pillar', variant: 'full' }, decor: { kind: 'lotus', variant: 'full' },
  lamps: { kind: 'lamp', variant: 'stand' }, utility: { kind: 'mortar', variant: 'pestle' }, gifts: { kind: 'kalash', variant: 'full' },
};

/** Add or edit a product. `product` null = add. onSave receives the cleaned product fields. */
export default function ProductFormModal({ open, onClose, product, onSave }) {
  const { t, label } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) { setForm(product ? { ...EMPTY, ...product } : EMPTY); setErrors({}); }
  }, [open, product]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (form.name.trim().length < 3) err.name = t('err.productName');
    if (!Number(form.price) || Number(form.price) < 1) err.price = t('err.price');
    if (form.description.trim().length < 15) err.description = t('err.description');
    if (form.madeToOrder && (Number(form.leadDays) < 1)) err.leadDays = t('err.leadDays');
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      leadDays: form.madeToOrder ? Number(form.leadDays) : 0,
      stone: 'Durgi stone',
      tone: product?.tone || TONE_BY_CATEGORY[form.category],
      art: product?.art || ART_BY_CATEGORY[form.category],
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={product ? t('product.editTitle') : t('product.addTitle')}
      footer={
        <>
          <button type="button" className="btn btn-soft" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" form="product-form" className="btn btn-primary"><Save className="h-5 w-5" aria-hidden /> {product ? t('saveChanges') : t('product.publish')}</button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} className="space-y-5" noValidate>
        <FormField id="pf-name" label={t('product.name')} error={errors.name} hint={t('product.nameHint')}>
          <input id="pf-name" className={`input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={set('name')} />
        </FormField>
        <FormField id="pf-name-te" label={t('product.nameTe')} optional optionalLabel={t('optional')}>
          <input id="pf-name-te" className="input" value={form.name_te} onChange={set('name_te')} lang="te" />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="pf-cat" label={t('field.category')}>
            <select id="pf-cat" className="input" value={form.category} onChange={set('category')}>
              {categories.map((c) => <option key={c.key} value={c.key}>{label(categories, c.key)}</option>)}
            </select>
          </FormField>
          <FormField id="pf-price" label={t('product.priceInr')} error={errors.price}>
            <input id="pf-price" type="number" min="1" inputMode="numeric" className={`input ${errors.price ? 'input-error' : ''}`} value={form.price} onChange={set('price')} />
          </FormField>
          <FormField id="pf-size" label={t('product.size')} optional optionalLabel={t('optional')} hint={t('product.sizeHint')}>
            <input id="pf-size" className="input" value={form.size} onChange={set('size')} />
          </FormField>
          <FormField id="pf-weight" label={t('product.weight')} optional optionalLabel={t('optional')}>
            <input id="pf-weight" className="input" value={form.weight} onChange={set('weight')} />
          </FormField>
        </div>
        <FormField id="pf-desc" label={t('product.description')} error={errors.description} hint={t('product.descriptionHint')}>
          <textarea id="pf-desc" rows={4} className={`input ${errors.description ? 'input-error' : ''}`} value={form.description} onChange={set('description')} />
        </FormField>
        <FormField id="pf-desc-te" label={t('product.descriptionTe')} optional optionalLabel={t('optional')}>
          <textarea id="pf-desc-te" rows={3} className="input" value={form.description_te} onChange={set('description_te')} lang="te" />
        </FormField>
        <div className="rounded-xl2 bg-sandstone-50 p-4">
          <label className="flex min-h-[48px] cursor-pointer items-center gap-3 text-base font-semibold">
            <input type="checkbox" className="h-6 w-6 accent-terracotta-600" checked={form.madeToOrder} onChange={set('madeToOrder')} />
            {t('product.madeToOrderLabel')}
          </label>
          {form.madeToOrder && (
            <div className="mt-3 max-w-xs">
              <FormField id="pf-lead" label={t('product.leadDays')} error={errors.leadDays}>
                <input id="pf-lead" type="number" min="1" className={`input ${errors.leadDays ? 'input-error' : ''}`} value={form.leadDays} onChange={set('leadDays')} />
              </FormField>
            </div>
          )}
        </div>
        <div>
          <p className="label">{t('product.photos')}</p>
          <ImageUploader value={form.photos} onChange={(photos) => setForm((f) => ({ ...f, photos }))} max={4} label={t('product.photo')} />
        </div>
      </form>
    </Modal>
  );
}
