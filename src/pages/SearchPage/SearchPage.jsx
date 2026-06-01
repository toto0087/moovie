import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { movies } from '../../data/movies';
import styles from './SearchPage.module.css';

export function SearchPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter((m) => m.title.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className={styles.page}>
      <PageHeader />
      <div className={styles.searchSection}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar películas y series"
        />
      </div>
      <MovieGrid movies={filtered} />
    </div>
  );
}
