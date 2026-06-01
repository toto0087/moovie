import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ContentTabs } from '../../components/ContentTabs/ContentTabs';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { movies, tabFilters } from '../../data/movies';
import styles from './HomePage.module.css';

export function HomePage({ variant = 'grid' }) {
  const [activeTab, setActiveTab] = useState('novedades');

  const filtered = useMemo(() => tabFilters[activeTab](movies), [activeTab]);

  return (
    <div className={styles.page}>
      <PageHeader />
      {variant === 'tabs' && <ContentTabs active={activeTab} onChange={setActiveTab} />}
      <MovieGrid movies={filtered} />
    </div>
  );
}
