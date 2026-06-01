import { MovieCard } from '../MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

export function MovieGrid({ movies }) {
  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
