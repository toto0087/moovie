import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

export function MovieCard({ movie }) {
  return (
    <Link to={`/titulo/${movie.id}`} className={styles.card}>
      <div className={styles.posterWrap}>
        <img src={movie.poster} alt={movie.title} className={styles.poster} loading="lazy" />
        {movie.platform === 'netflix' && (
          <span className={styles.netflixBadge} aria-label="Netflix">N</span>
        )}
        {movie.badge && <span className={styles.topBadge}>{movie.badge}</span>}
      </div>
      <h3 className={styles.title}>{movie.title}</h3>
    </Link>
  );
}
