import { TriangleAlert } from 'lucide-react';
import Modal from './Modal.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function ConfirmDialog({ open, title, message, confirmLabel, danger = true, onConfirm, onCancel }) {
  const { t } = useLang();
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button className="btn btn-soft" onClick={onCancel}>{t('cancel')}</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmLabel || t('yesContinue')}</button>
        </>
      }
    >
      <div className="flex gap-4">
        {danger && <TriangleAlert className="h-8 w-8 shrink-0 text-red-700" aria-hidden />}
        <p className="text-lg">{message}</p>
      </div>
    </Modal>
  );
}
