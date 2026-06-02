import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { MovieCarousel } from '../../components/MovieCarousel/MovieCarousel';
import { ContentTabs } from '../../components/ContentTabs/ContentTabs';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { movies, popularNow, tabFilters } from '../../data/movies';
import styles from './HomePage.module.css';

export function HomePage({ variant = 'home' }) {
  const [activeTab, setActiveTab] = useState('novedades');

  const popular = useMemo(() => popularNow, []);
  const tabbed = useMemo(() => tabFilters[activeTab](movies), [activeTab]);

  if (variant === 'tabs') {
    return (
      <div className={styles.page}>
        <PageHeader />
        <ContentTabs active={activeTab} onChange={setActiveTab} />
        <MovieGrid movies={tabbed} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader />
      <section className={styles.section} aria-labelledby="popular-heading">
        <h2 id="popular-heading" className={styles.sectionTitle}>
          Populares
        </h2>
        <MovieCarousel movies={popular} fill />
      </section>
    </div>
  );
}
