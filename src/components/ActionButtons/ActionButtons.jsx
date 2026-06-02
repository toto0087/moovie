import { FiCheck, FiPlus } from 'react-icons/fi';
import { useMyList } from '../../context/MyListContext';
import styles from './ActionButtons.module.css';

export function ActionButtons({ movieId, ageRating }) {
  const { isInList, toggleInList } = useMyList();
  const inList = isInList(movieId);

  return (
    <div className={styles.row}>
      <button type="button" className={styles.pill}>
        Ver en <span className={styles.netflixN}>N</span>
      </button>
      <button type="button" className={styles.pill}>
        + {ageRating}
      </button>
      <button
        type="button"
        className={`${styles.pill} ${inList ? styles.pillActive : ''}`}
        onClick={() => toggleInList(movieId)}
        aria-pressed={inList}
        aria-label={inList ? 'Quitar de mi lista' : 'Agregar a mi lista'}
      >
        {inList ? <FiCheck aria-hidden /> : <FiPlus aria-hidden />}
        Mi Lista
      </button>
    </div>
  );
}
