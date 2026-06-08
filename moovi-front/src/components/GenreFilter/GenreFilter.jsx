import { useEffect, useRef, useState } from 'react';
import styles from './GenreFilter.module.css';

const SCROLL_AMOUNT = 160;

export function GenreFilter({ genres, activeGenre, onSelect, allLabel = 'Todo' }) {
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows);
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro.disconnect();
    };
  }, [genres]);

  const scrollBy = (delta) => {
    listRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className={styles.wrapper}>
      {canScrollLeft && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => scrollBy(-SCROLL_AMOUNT)}
          aria-label="Anterior"
        >
          ‹
        </button>
      )}

      <div ref={listRef} className={styles.list} role="group" aria-label="Filtrar por categoría">
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

      {canScrollRight && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => scrollBy(SCROLL_AMOUNT)}
          aria-label="Siguiente"
        >
          ›
        </button>
      )}
    </div>
  );
}
