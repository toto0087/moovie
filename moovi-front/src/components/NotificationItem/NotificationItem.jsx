import { Link } from 'react-router-dom';
import { FiBookmark, FiInfo, FiMessageCircle, FiPlus } from 'react-icons/fi';
import { FlameIcon } from '../icons/FlameIcon';
import { platformMeta } from '../../data/platforms';
import { useI18n } from '../../context/I18nContext';
import styles from './NotificationItem.module.css';

const typeIcons = {
  new_content: FiPlus,
  trending: FlameIcon,
  recommendation: FiMessageCircle,
  agent: FiMessageCircle,
  list: FiBookmark,
  system: FiInfo,
};

export function NotificationItem({ notification, onRead }) {
  const { t } = useI18n();
  const { id, type, title, message, timeLabel, movie, unread } = notification;
  const Icon = typeIcons[type] ?? FiInfo;
  const isFlame = type === 'trending';
  const platform = movie?.platform ? platformMeta[movie.platform] : null;
  const target = movie ? `/titulo/${movie.id}` : null;

  const content = (
    <>
      <span className={`${styles.iconWrap} ${unread ? styles.iconUnread : ''}`}>
        {isFlame ? <FlameIcon className={styles.flameIcon} /> : <Icon aria-hidden />}
      </span>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>{title}</h3>
          {unread && <span className={styles.dot} aria-label={t('notifications.unreadLabel')} />}
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.meta}>
          <span className={styles.time}>{timeLabel}</span>
          {platform && (
            <span className={styles.platform}>{platform.label}</span>
          )}
        </div>
      </div>

      {movie?.poster && (
        <img src={movie.poster} alt="" className={styles.thumb} loading="lazy" />
      )}
    </>
  );

  if (target) {
    return (
      <Link
        to={target}
        className={`${styles.card} ${unread ? styles.unread : ''}`}
        onClick={() => onRead?.(id)}
      >
        {content}
      </Link>
    );
  }

  return (
    <article className={`${styles.card} ${unread ? styles.unread : ''}`}>
      {content}
    </article>
  );
}
