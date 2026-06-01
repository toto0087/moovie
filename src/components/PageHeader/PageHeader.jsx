import { Link } from 'react-router-dom';
import { Logo } from '../Logo/Logo';
import styles from './PageHeader.module.css';

export function PageHeader({ showLogo = true, rightAction }) {
  return (
    <header className={styles.header}>
      {showLogo && (
        <Link to="/home" className={styles.logoLink} aria-label="Ir al inicio">
          <Logo className={styles.logo} />
        </Link>
      )}
      {rightAction && <div className={styles.right}>{rightAction}</div>}
    </header>
  );
}
