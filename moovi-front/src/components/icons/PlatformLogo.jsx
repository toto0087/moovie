import { useState } from 'react';
import { platformMeta } from '../../data/platforms';

export function hasPlatformLogo(slug) {
  return Boolean(platformMeta[slug]?.logo);
}

export function PlatformLogo({ slug, logoUrl, className, imageClassName, onError }) {
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
