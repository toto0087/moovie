import { platformMeta } from '../../data/platforms';
import styles from './PlatformBadge.module.css';

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

export function PlatformBadge({ platformId, size = 'md' }) {
  const platform = platformMeta[platformId];
  if (!platform) return null;

  return (
    <span
      className={`${styles.badge} ${styles[size]} ${platformClass[platformId] ?? ''}`}
      aria-label={platform.label}
    >
      {platform.short}
    </span>
  );
}
