import { FiSearch, FiMessageCircle } from 'react-icons/fi';
import styles from './SearchBar.module.css';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search',
  onAgentClick,
  agentOpen = false,
}) {
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
      {onAgentClick && (
        <button
          type="button"
          className={`${styles.agentBtn} ${agentOpen ? styles.agentBtnActive : ''}`}
          aria-label={agentOpen ? 'Cerrar asistente Moovi' : 'Abrir asistente Moovi'}
          aria-pressed={agentOpen}
          onClick={onAgentClick}
        >
          <FiMessageCircle aria-hidden />
        </button>
      )}
    </div>
  );
}
