export const platformMeta = {
  netflix: { short: 'N', label: 'Netflix' },
  hbo: { short: 'HBO', label: 'HBO Max' },
  'disney-plus': { short: 'D+', label: 'Disney+' },
};

export const ALL_PLATFORM_IDS = Object.keys(platformMeta);

export const DEFAULT_PLATFORMS = {
  netflix: true,
  hbo: true,
  'disney-plus': true,
};

export function normalizePlatforms(stored = {}) {
  return ALL_PLATFORM_IDS.reduce((acc, id) => {
    acc[id] = Boolean(stored[id]);
    return acc;
  }, {});
}

export function buildPlatformMetaFromApi(platforms) {
  return (platforms ?? []).reduce((acc, p) => {
    acc[p.slug] = { short: p.short_name, label: p.name };
    return acc;
  }, { ...platformMeta });
}
