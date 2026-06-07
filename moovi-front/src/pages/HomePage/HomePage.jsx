import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { MovieCarousel } from '../../components/MovieCarousel/MovieCarousel';
import { ContentTabs } from '../../components/ContentTabs/ContentTabs';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { useI18n } from '../../context/I18nContext';
import { useTrending } from '../../hooks/useTrending';
import { useMoviesTab } from '../../hooks/useMoviesTab';
import styles from './HomePage.module.css';

export function HomePage({ variant = 'home' }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('novedades');
  const { movies: trending, loading: trendingLoading } = useTrending();
  const { movies: tabbed, loading: tabLoading } = useMoviesTab(activeTab);

  if (variant === 'tabs') {
    return (
      <div className={styles.page}>
        <PageHeader />
        <ContentTabs active={activeTab} onChange={setActiveTab} />
        {tabLoading ? (
          <p className={styles.loading}>{t('common.loading')}</p>
        ) : tabbed.length === 0 ? (
          <p className={styles.empty}>{t('home.empty')}</p>
        ) : (
          <MovieGrid movies={tabbed} />
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader />
      <section className={styles.section} aria-labelledby="popular-heading">
        <h2 id="popular-heading" className={styles.sectionTitle}>
          {t('home.popular')}
        </h2>
        {trendingLoading ? (
          <p className={styles.loading}>{t('common.loading')}</p>
        ) : trending.length === 0 ? (
          <p className={styles.empty}>{t('home.empty')}</p>
        ) : (
          <MovieCarousel movies={trending} fill />
        )}
      </section>
    </div>
  );
}
