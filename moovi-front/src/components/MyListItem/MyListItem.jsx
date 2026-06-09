import { Link } from 'react-router-dom';
import { AgeBadge } from '../AgeBadge/AgeBadge';
import { PopularityTrendIcon } from '../PopularityTrendIcon/PopularityTrendIcon';
import { usePlatforms } from '../../context/PlatformsContext';
import styles from './MyListItem.module.css';

const platformClass = {
  netflix: styles.netflix,
  hbo: styles.hbo,
  'disney-plus': styles.disneyPlus,
  'amazon-prime': styles.amazonPrime,
  'apple-tv': styles.appleTv,
  'paramount-plus': styles.paramountPlus,
  'star-plus': styles.starPlus,
  crunchyroll: styles.crunchyroll,
  'pluto-tv': styles.plutoTv,
  mubi: styles.mubi,
  clarovideo: styles.clarovideo,
};

export function MyListItem({ movie }) {
  const { platformMeta } = usePlatforms();
  const platform = platformMeta[movie.platform];

  return (
    <li>
      <Link to={`/titulo/${movie.id}`} className={styles.row}>
        <div className={styles.thumbWrap}>
          <img src={movie.poster} alt="" className={styles.thumb} loading="lazy" />
          {platform && (
            <div className={styles.badges}>
              <span
                className={`${styles.platformBadge} ${platformClass[movie.platform] ?? ''}`}
                aria-label={platform.label}
              >
                {platform.short}
              </span>
              {movie.popularityTrend && (
                <span className={styles.trendBadge} aria-hidden>
                  <PopularityTrendIcon trend={movie.popularityTrend} />
                </span>
              )}
              <AgeBadge age={movie.ageRating} />
            </div>
          )}
          {!platform && <AgeBadge age={movie.ageRating} className={styles.ageOnly} />}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{movie.title}</h3>
          {movie.genre && <p className={styles.genre}>{movie.genre}</p>}
        </div>
      </Link>
    </li>
  );
}
