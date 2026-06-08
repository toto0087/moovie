import styles from './SettingsToggle.module.css';

export function SettingsToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.toggle} ${checked ? styles.on : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.thumb} />
    </button>
  );
}
