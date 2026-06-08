import styles from './SettingsSection.module.css';

export function SettingsSection({ title, description, children }) {
  return (
    <section className={styles.section}>
      {(title || description) && (
        <div className={styles.heading}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      <div className={styles.card}>{children}</div>
    </section>
  );
}
