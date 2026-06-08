import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { MovieCarousel } from '../../components/MovieCarousel/MovieCarousel';
import { ContentTabs } from '../../components/ContentTabs/ContentTabs';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { useI18n } from '../../context/I18nContext';
import { useTrending } from '../../hooks/useTrending';
import { useMoviesTab } from '../../hooks/useMoviesTab';
import { useGenres } from '../../hooks/useGenres';
import { GenreFilter } from '../../components/GenreFilter/GenreFilter';
import styles from './HomePage.module.css';

export function HomePage({ variant = 'home' }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('novedades');
  const [activeGenre, setActiveGenre] = useState(null);
  const genres = useGenres();
  const { movies: trending, loading: trendingLoading } = useTrending();
  const { movies: tabbed, loading: tabLoading, loadingMore, hasMore, loadMore } = useMoviesTab(activeTab, null, activeGenre);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveGenre(null);
  };

  if (variant === 'tabs') {
    return (
      <div className={styles.tabsPage}>
        <PageHeader />
        <ContentTabs active={activeTab} onChange={handleTabChange} />

        {genres.length > 0 && (
          <GenreFilter
            genres={genres}
            activeGenre={activeGenre}
            onSelect={setActiveGenre}
            allLabel={t('home.filterAll')}
          />
        )}

        {tabLoading ? (
          <p className={styles.loading}>{t('common.loading')}</p>
        ) : tabbed.length === 0 ? (
          <p className={styles.empty}>{t('home.empty')}</p>
        ) : (
          <MovieGrid movies={tabbed} />
        )}

        {!tabLoading && hasMore && (
          <div className={styles.loadMoreFloat}>
            <button
              type="button"
              className={styles.loadMoreBtn}
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? t('common.loading') : t('home.loadMore')}
            </button>
          </div>
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
