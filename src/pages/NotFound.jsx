import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '../components/ui.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="container-x py-20">
      <EmptyState level={1} icon={Compass}title={t('notFound.title')} text={t('notFound.text')} action={<div className="flex gap-3"><Link to="/" className="btn btn-primary">{t('nav.home')}</Link><Link to="/explore" className="btn btn-soft">{t('nav.explore')}</Link></div>} />
    </div>
  );
}
