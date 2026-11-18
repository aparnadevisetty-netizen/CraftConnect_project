export const cn = (...parts) => parts.filter(Boolean).join(' ');

export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export function formatDate(iso, lang = 'en') {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(iso, lang = 'en') {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  const rtf = new Intl.RelativeTimeFormat(lang === 'te' ? 'te' : 'en', { numeric: 'auto' });
  if (m < 60) return rtf.format(-Math.max(m, 1), 'minute');
  const h = Math.floor(m / 60);
  if (h < 24) return rtf.format(-h, 'hour');
  const d = Math.floor(h / 24);
  if (d < 30) return rtf.format(-d, 'day');
  return formatDate(iso, lang);
}

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export const isValidPhone = (p) => /^[6-9]\d{9}$/.test(String(p || '').replace(/\s|-/g, ''));
export const cleanPhone = (p) => String(p || '').replace(/\D/g, '').slice(-10);

export const whatsappLink = (phone, text) =>
  `https://wa.me/91${cleanPhone(phone)}?text=${encodeURIComponent(text || '')}`;

/**
 * Shrinks an uploaded image in the browser before it is stored or sent.
 * Keeps pages light on slow networks. When Cloudinary is connected, upload the original and store the returned URL instead.
 */
export function compressImage(file, maxDim = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('not-image'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('load-failed'));
    };
    img.src = url;
  });
}
