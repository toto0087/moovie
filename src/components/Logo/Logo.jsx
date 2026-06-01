import styles from './Logo.module.css';

export function Logo({ size = 'md', className = '' }) {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`} aria-label="Moovi">
      <span className={styles.eye} />
      <span className={styles.bridge} />
      <span className={styles.eye} />
    </div>
  );
}
