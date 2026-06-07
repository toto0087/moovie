import { useParams, Navigate } from 'react-router-dom';
import { DetailHeader } from '../../components/DetailHeader/DetailHeader';
import { ActionButtons } from '../../components/ActionButtons/ActionButtons';
import { useMovieDetail } from '../../hooks/useMovieDetail';
import { getMoviePlatforms } from '../../utils/getMoviePlatforms';
import { useI18n } from '../../context/I18nContext';
import styles from './TitleDetailPage.module.css';

export function TitleDetailPage() {
  const { id } = useParams();
  const { t } = useI18n();
  const { movie, loading, error } = useMovieDetail(id);
  const platforms = getMoviePlatforms(movie);

  if (loading) {
    return <p className={styles.loading}>{t('common.loading')}</p>;
  }

  if (!movie || error) return <Navigate to="/home" replace />;

  return (
    <article className={styles.page}>
      <DetailHeader title={movie.title} genre={movie.genre} />
      {movie.poster && (
        <img src={movie.poster} alt={movie.title} className={styles.hero} />
      )}
      {movie.synopsis && <p className={styles.synopsis}>{movie.synopsis}</p>}
      <ActionButtons
        movieId={movie.id}
        ageRating={movie.ageRating}
        platforms={platforms}
      />
    </article>
  );
}
