import { Link } from 'react-router-dom';
import { PopularityTrendIcon } from '../PopularityTrendIcon/PopularityTrendIcon';
import { platformMeta } from '../../data/movies';
import styles from './MovieCard.module.css';

const platformClass = {
  netflix: styles.netflix,
  hbo: styles.hbo,
  'disney-plus': styles.disneyPlus,
};

const trendLabels = {
  up: 'Tendencia positiva',
  down: 'Tendencia negativa',
};

export function MovieCard({ movie }) {
  const platform = platformMeta[movie.platform];
  const trend = movie.popularityTrend;

  return (
    <Link to={`/titulo/${movie.id}`} className={styles.card}>
      <div className={styles.posterWrap}>
        <img src={movie.poster} alt={movie.title} className={styles.poster} loading="lazy" />
        {platform && (
          <div className={styles.platformRow}>
            <span
              className={`${styles.platformBadge} ${platformClass[movie.platform] ?? ''}`}
              aria-label={platform.label}
            >
              {platform.short}
            </span>
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
      </div>
      <h3 className={styles.title}>{movie.title}</h3>
    </Link>
  );
}
