import { useState } from 'react';
import { usePlatforms } from '../../context/PlatformsContext';
import { PlatformLogo } from '../icons/PlatformLogo';
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

export function PlatformBadge({ platformId, logoUrl, size = 'md' }) {
  const { platformMeta } = usePlatforms();
  const platform = platformMeta[platformId];
  const [logoFailed, setLogoFailed] = useState(false);

  if (!platform) return null;

  const resolvedLogo = logoUrl ?? platform.logo;
  const showLogo = Boolean(resolvedLogo) && !logoFailed;

  return (
    <span
      className={`${styles.badge} ${styles[size]} ${platformClass[platformId] ?? ''} ${
        showLogo ? styles.hasImageLogo : ''
      }`}
      aria-label={platform.label}
    >
      {showLogo ? (
        <PlatformLogo
          slug={platformId}
          logoUrl={resolvedLogo}
          imageClassName={styles.logoImage}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        platform.short
      )}
    </span>
  );
}
