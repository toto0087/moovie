import { formatAgeRating, hasAgeRating } from '../../utils/formatAgeRating';
import styles from './AgeBadge.module.css';

export function AgeBadge({ age, size = 'sm', className = '' }) {
  if (!hasAgeRating(age)) return null;

  const label = formatAgeRating(age);

  return (
    <span
      className={`${styles.badge} ${styles[size]} ${className}`.trim()}
      aria-label={`Clasificación ${label}`}
    >
      {label}
    </span>
  );
}
