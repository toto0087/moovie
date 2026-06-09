import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { buildPlatformMetaFromApi, platformMeta as fallbackPlatformMeta } from '../data/platforms';

const PlatformsContext = createContext(null);

export function PlatformsProvider({ children }) {
  const [platformMeta, setPlatformMeta] = useState(fallbackPlatformMeta);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get('/platforms')
      .then(({ data }) => {
        if (cancelled) return;
        setPlatformMeta(buildPlatformMetaFromApi(data));
      })
      .catch(() => {
        if (!cancelled) setPlatformMeta(fallbackPlatformMeta);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allPlatformIds = useMemo(() => Object.keys(platformMeta), [platformMeta]);

  const value = useMemo(
    () => ({ platformMeta, allPlatformIds, loading }),
    [platformMeta, allPlatformIds, loading]
  );

  return <PlatformsContext.Provider value={value}>{children}</PlatformsContext.Provider>;
}

export function usePlatforms() {
  const context = useContext(PlatformsContext);
  if (!context) {
    throw new Error('usePlatforms debe usarse dentro de PlatformsProvider');
  }
  return context;
}
