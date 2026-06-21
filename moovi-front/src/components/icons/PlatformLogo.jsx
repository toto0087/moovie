import { useState } from 'react';
import { usePlatforms } from '../../context/PlatformsContext';

export function hasPlatformLogo(slug, platformMeta) {
  return Boolean(platformMeta?.[slug]?.logo);
}

export function PlatformLogo({ slug, logoUrl, className, imageClassName, onError }) {
  const { platformMeta } = usePlatforms();
  const platform = platformMeta[slug];
  const src = logoUrl ?? platform?.logo;
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  const handleError = () => {
    setFailed(true);
    onError?.();
  };

  return (
    <img
      src={src}
      alt=""
      className={imageClassName ?? className}
      loading="lazy"
      draggable={false}
      onError={handleError}
    />
  );
}
