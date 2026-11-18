import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations.js';

const LanguageContext = createContext(null);
export const useLang = () => useContext(LanguageContext);

const KEY = 'craftconnect:lang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(KEY) === 'te' ? 'te' : 'en'; } catch { return 'en'; }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  /** t('key', { name: 'Asha' }) — falls back to English, then to the key itself. */
  const t = useCallback(
    (key, vars) => {
      let s = translations[lang]?.[key] ?? translations.en[key] ?? key;
      if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replaceAll(`{${k}}`, v); });
      return s;
    },
    [lang]
  );

  /** tr(product, 'name') returns product.name_te when Telugu is active and present. */
  const tr = useCallback((obj, field) => (lang === 'te' && obj?.[`${field}_te`]) || obj?.[field] || '', [lang]);

  /** label(categories, key) for { key, en, te } option lists. */
  const label = useCallback((list, key) => {
    const item = list.find((x) => x.key === key);
    return item ? item[lang] || item.en : key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang: setLangState, t, tr, label }), [lang, t, tr, label]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
