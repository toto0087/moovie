import { PageHeader } from '../../components/PageHeader/PageHeader';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { useI18n } from '../../context/I18nContext';
import { useTrending } from '../../hooks/useTrending';
import styles from './FavoritesPage.module.css';

export function FavoritesPage() {
  const { t } = useI18n();
  const { movies, loading } = useTrending();

  return (
    <div className={styles.page}>
      <PageHeader />
      <section className={styles.section} aria-labelledby="tendencia-heading">
        <h2 id="tendencia-heading" className={styles.title}>
          {t('trending.title')}
        </h2>
        <p className={styles.subtitle}>{t('trending.subtitle')}</p>
        {loading ? (
          <p className={styles.empty}>{t('common.loading')}</p>
        ) : movies.length === 0 ? (
          <p className={styles.empty}>{t('search.empty')}</p>
        ) : (
          <MovieGrid movies={movies} />
        )}
      </section>
    </div>
  );
}
