import { MovieCard } from '../MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

export function MovieGrid({ movies }) {
  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <div key={movie.id} className={styles.cell}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}
