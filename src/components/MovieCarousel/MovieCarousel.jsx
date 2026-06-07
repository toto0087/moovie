import { Link } from 'react-router-dom';
import styles from './MovieCarousel.module.css';

export function MovieCarousel({ movies, fill = false }) {
  if (!movies || movies.length === 0) {
    return <p className={`${styles.empty} ${fill ? styles.emptyFill : ''}`}>No hay resultados.</p>;
  }

  return (
    <div className={`${styles.carousel} ${fill ? styles.fill : ''}`}>
      {movies.map((movie) => (
        <Link key={movie.id} to={`/titulo/${movie.id}`} className={styles.card}>
          <div className={styles.media}>
            <img src={movie.poster_url} alt="" loading="lazy" />
            <h3 className={styles.title}>{movie.title}</h3>
            {movie.overview && <p className={styles.synopsis}>{movie.overview}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
