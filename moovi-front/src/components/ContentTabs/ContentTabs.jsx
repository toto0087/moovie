import { useI18n } from '../../context/I18nContext';
import styles from './ContentTabs.module.css';

const TAB_KEYS = [
  { id: 'novedades', labelKey: 'contentTabs.new' },
  { id: 'recientes', labelKey: 'contentTabs.recent' },
  { id: 'populares', labelKey: 'contentTabs.popular' },
];

export function ContentTabs({ active, onChange }) {
  const { t } = useI18n();

  return (
    <div className={styles.tabs} role="tablist">
      {TAB_KEYS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {t(tab.labelKey)}
        </button>
      ))}
    </div>
  );
}
