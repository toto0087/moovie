import { Link } from 'react-router-dom';
import { AgeBadge } from '../AgeBadge/AgeBadge';
import styles from './MovieCarousel.module.css';

export function MovieCarousel({ movies, fill = false }) {
  if (!movies.length) {
    return <p className={`${styles.empty} ${fill ? styles.emptyFill : ''}`}>No hay resultados.</p>;
  }

  return (
    <div className={`${styles.carousel} ${fill ? styles.fill : ''}`}>
      {movies.map((movie) => (
        <Link key={movie.id} to={`/titulo/${movie.id}`} className={styles.card}>
          <div className={styles.media}>
            <img src={movie.poster} alt="" loading="lazy" />
            <h3 className={styles.title}>{movie.title}</h3>
            <AgeBadge age={movie.ageRating} size="md" className={styles.ageBadge} />
            {movie.synopsis && <p className={styles.synopsis}>{movie.synopsis}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
