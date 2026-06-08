import { FiCheck, FiPlus } from 'react-icons/fi';
import { PlatformBadge } from '../PlatformBadge/PlatformBadge';
import { useMyList } from '../../context/MyListContext';
import { useI18n } from '../../context/I18nContext';
import { formatAgeRating, hasAgeRating } from '../../utils/formatAgeRating';
import styles from './ActionButtons.module.css';

export function ActionButtons({ movieId, ageRating, platforms = [] }) {
  const { t } = useI18n();
  const { isInList, toggleInList } = useMyList();
  const inList = isInList(movieId);
  const ageLabel = formatAgeRating(ageRating);

  return (
    <div className={styles.row}>
      <button type="button" className={styles.pill}>
        {t('titleDetail.watchOn')}
        <span className={styles.platformGroup}>
          {platforms.map((platformId) => (
            <PlatformBadge key={platformId} platformId={platformId} size="sm" />
          ))}
        </span>
      </button>
      {hasAgeRating(ageRating) && (
        <button type="button" className={styles.pill}>
          {ageLabel}
        </button>
      )}
      <button
        type="button"
        className={`${styles.pill} ${inList ? styles.pillActive : ''}`}
        onClick={() => toggleInList(movieId)}
        aria-pressed={inList}
        aria-label={inList ? t('titleDetail.removeList') : t('titleDetail.addList')}
      >
        {inList ? <FiCheck aria-hidden /> : <FiPlus aria-hidden />}
        {t('titleDetail.myList')}
      </button>
    </div>
  );
}
