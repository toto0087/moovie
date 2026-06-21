import styles from './GenreFilter.module.css';

export function GenreFilter({ genres, activeGenre, onSelect, allLabel = 'Todo' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.list} role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          className={`${styles.chip} ${activeGenre === null ? styles.chipActive : ''}`}
          onClick={() => onSelect(null)}
        >
          {allLabel}
        </button>
        {genres.map((g) => (
          <button
            key={g}
            type="button"
            className={`${styles.chip} ${activeGenre === g ? styles.chipActive : ''}`}
            onClick={() => onSelect(activeGenre === g ? null : g)}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
