import { useParams, Navigate } from 'react-router-dom';
import { DetailHeader } from '../../components/DetailHeader/DetailHeader';
import { ActionButtons } from '../../components/ActionButtons/ActionButtons';
import { getMovieById } from '../../data/movies';
import styles from './TitleDetailPage.module.css';

export function TitleDetailPage() {
  const { id } = useParams();
  const movie = getMovieById(id);

  if (!movie) return <Navigate to="/home" replace />;

  return (
    <article className={styles.page}>
      <DetailHeader title={movie.title} genre={movie.genre} />
      <img src={movie.poster} alt={movie.title} className={styles.hero} />
      {movie.synopsis && <p className={styles.synopsis}>{movie.synopsis}</p>}
      <ActionButtons ageRating={movie.ageRating} />
    </article>
  );
}
