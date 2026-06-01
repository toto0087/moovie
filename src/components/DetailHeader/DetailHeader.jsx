import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { Logo } from '../Logo/Logo';
import styles from './DetailHeader.module.css';

export function DetailHeader({ title, genre }) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.logoRow}>
        <Logo size="sm" />
      </div>
      <div className={styles.navRow}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Volver">
          <FiChevronLeft />
        </button>
        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.genre}>{genre}</p>
        </div>
      </div>
    </header>
  );
}
