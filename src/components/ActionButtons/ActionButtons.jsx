import { FiCheck, FiPlus } from 'react-icons/fi';
import { useMyList } from '../../context/MyListContext';
import styles from './ActionButtons.module.css';

export function ActionButtons({ movie, ageRating }) {
  const { isInList, toggleInList } = useMyList();

  if (!movie?.id) return null;

  const inList = isInList(movie.id);
  const platformName = movie.platform?.short_name ?? 'N';

  return (
    <div className={styles.row}>
      <button type="button" className={styles.pill}>
        Ver en <span className={styles.netflixN}>{platformName}</span>
      </button>
      {ageRating != null && (
        <button type="button" className={styles.pill}>
          + {ageRating}
        </button>
      )}
      <button
        type="button"
        className={`${styles.pill} ${inList ? styles.pillActive : ''}`}
        onClick={() => toggleInList(movie.id)}
        aria-pressed={inList}
        aria-label={inList ? 'Quitar de mi lista' : 'Agregar a mi lista'}
      >
        {inList ? <FiCheck aria-hidden /> : <FiPlus aria-hidden />}
        Mi Lista
      </button>
    </div>
  );
}
