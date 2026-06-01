import { FiSearch, FiMic } from 'react-icons/fi';
import styles from './SearchBar.module.css';

export function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className={styles.wrapper}>
      <FiSearch className={styles.iconLeft} aria-hidden />
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label="Buscar contenido"
      />
      <button type="button" className={styles.micBtn} aria-label="Búsqueda por voz">
        <FiMic aria-hidden />
      </button>
    </div>
  );
}
