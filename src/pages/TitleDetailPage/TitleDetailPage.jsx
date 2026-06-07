import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailHeader } from '../../components/DetailHeader/DetailHeader';
import { ActionButtons } from '../../components/ActionButtons/ActionButtons';
import api from '../../services/api';
import styles from './TitleDetailPage.module.css';

export function TitleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch(() => navigate('/home', { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>Cargando...</div>;
  if (!movie) return null;

  const genre = Array.isArray(movie.genres)
    ? movie.genres.join(' - ')
    : typeof movie.genres === 'string'
      ? movie.genres
      : '';

  return (
    <article className={styles.page}>
      <DetailHeader title={movie.title} genre={genre} />
      <img src={movie.poster_url} alt={movie.title} className={styles.hero} />
      {movie.overview && <p className={styles.synopsis}>{movie.overview}</p>}
      <ActionButtons movie={movie} ageRating={movie.age_rating} />
    </article>
  );
}
