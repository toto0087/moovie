import styles from './ContentTabs.module.css';

const TABS = [
  { id: 'novedades', label: 'Novedades' },
  { id: 'recientes', label: 'Recien agregadas' },
  { id: 'populares', label: 'Populares' },
];

export function ContentTabs({ active, onChange }) {
  return (
    <div className={styles.tabs} role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
