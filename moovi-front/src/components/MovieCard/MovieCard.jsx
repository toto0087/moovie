import { Link } from 'react-router-dom';
import { AgeBadge } from '../AgeBadge/AgeBadge';
import { PlatformBadge } from '../PlatformBadge/PlatformBadge';
import { PopularityTrendIcon } from '../PopularityTrendIcon/PopularityTrendIcon';
import styles from './MovieCard.module.css';

const trendLabels = {
  up: 'Tendencia positiva',
  down: 'Tendencia negativa',
};

export function MovieCard({ movie }) {
  const trend = movie.popularityTrend;

  return (
    <Link to={`/titulo/${movie.id}`} className={styles.card}>
      <div className={styles.posterWrap}>
        <img src={movie.poster} alt={movie.title} className={styles.poster} loading="lazy" />
        {movie.platform && (
          <div className={styles.platformRow}>
            <PlatformBadge platformId={movie.platform} logoUrl={movie.platformLogo} size="md" />
            {trend && (
              <span
                className={styles.trendBadge}
                aria-label={trendLabels[trend]}
              >
                <PopularityTrendIcon trend={trend} />
              </span>
            )}
          </div>
        )}
        {movie.badge && <span className={styles.topBadge}>{movie.badge}</span>}
        <AgeBadge age={movie.ageRating} className={styles.ageBadge} />
      </div>
      <h3 className={styles.title}>{movie.title}</h3>
    </Link>
  );
}
