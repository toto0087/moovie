import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationsContext';
import { useI18n } from '../../context/I18nContext';
import styles from './NotificationsPage.module.css';

export function NotificationsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { unreadCount } = useNotifications();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(-1)}
          aria-label={t('common.back')}
        >
          <FiChevronLeft aria-hidden />
        </button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{t('notifications.title')}</h1>
          {unreadCount > 0 && (
            <p className={styles.subtitle}>{t('notifications.unread', { count: unreadCount })}</p>
          )}
        </div>
      </header>

      <div className={styles.content}>
        <p className={styles.empty}>{t('notifications.empty')}</p>
      </div>
    </div>
  );
}
