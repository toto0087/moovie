import { useState } from 'react';
import { FiCheck, FiPlus } from 'react-icons/fi';
import styles from './ActionButtons.module.css';

export function ActionButtons({ ageRating, inList: initialInList = false }) {
  const [inList, setInList] = useState(initialInList);

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
        className={styles.pill}
        onClick={() => setInList((v) => !v)}
        aria-pressed={inList}
      >
        {inList ? <FiCheck aria-hidden /> : <FiPlus aria-hidden />}
        Mi Lista
      </button>
    </div>
  );
}
