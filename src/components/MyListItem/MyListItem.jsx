import { Link } from 'react-router-dom';
import { PopularityTrendIcon } from '../PopularityTrendIcon/PopularityTrendIcon';
import styles from './MyListItem.module.css';

const platformClass = {
  netflix: styles.netflix,
  hbo: styles.hbo,
  'disney-plus': styles.disneyPlus,
};

export function MyListItem({ movie }) {
  const platform = movie.platform;
  const genre = Array.isArray(movie.genres) ? movie.genres.join(' - ') : movie.genres;

  return (
    <li>
      <Link to={`/titulo/${movie.id}`} className={styles.row}>
        <div className={styles.thumbWrap}>
          <img src={movie.poster_url} alt="" className={styles.thumb} loading="lazy" />
          {platform && (
            <div className={styles.badges}>
              <span
                className={`${styles.platformBadge} ${platformClass[platform.slug] ?? ''}`}
                aria-label={platform.name}
              >
                {platform.short_name}
              </span>
              {movie.popularity_trend && (
                <span className={styles.trendBadge} aria-hidden>
                  <PopularityTrendIcon trend={movie.popularity_trend} />
                </span>
              )}
            </div>
          )}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{movie.title}</h3>
          {genre && <p className={styles.genre}>{genre}</p>}
        </div>
      </Link>
    </li>
  );
}
