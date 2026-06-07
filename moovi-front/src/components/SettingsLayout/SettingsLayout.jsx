import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useI18n } from '../../context/I18nContext';
import styles from './SettingsLayout.module.css';

export function SettingsLayout({ title, subtitle, action, backTo, children }) {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={handleBack}
          aria-label={t('common.back')}
        >
          <FiChevronLeft aria-hidden />
        </button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.headerAction}>{action}</div>}
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
