const TMDB_LOGO_BASE = 'https://image.tmdb.org/t/p/w92';

export function tmdbLogoUrl(logoPath) {
  if (!logoPath) return null;
  const path = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
  return `${TMDB_LOGO_BASE}${path}`;
}

export const platformMeta = {
  netflix: {
    short: 'N',
    label: 'Netflix',
    logo: tmdbLogoUrl('/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg'),
  },
  hbo: {
    short: 'HBO',
    label: 'HBO Max',
    logo: tmdbLogoUrl('/jbe4gVSfRlbPTdESXhEKpornsfu.jpg'),
  },
  'disney-plus': {
    short: 'D+',
    label: 'Disney+',
    logo: tmdbLogoUrl('/97yvRBw1GzX7fXprcF80er19ot.jpg'),
  },
  'amazon-prime': {
    short: 'Prime',
    label: 'Prime Video',
    logo: tmdbLogoUrl('/pvske1MyAoymrs5bguRfVqYiM9a.jpg'),
  },
  'apple-tv': {
    short: 'TV+',
    label: 'Apple TV+',
    logo: tmdbLogoUrl('/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg'),
  },
  'paramount-plus': {
    short: 'P+',
    label: 'Paramount+',
    logo: tmdbLogoUrl('/h5DcR0J2EESLitnhR8xLG1QymTE.jpg'),
  },
  'star-plus': {
    short: 'S+',
    label: 'Star+',
    logo: '/assets/platforms/star-plus.svg',
  },
  crunchyroll: {
    short: 'CR',
    label: 'Crunchyroll',
    logo: tmdbLogoUrl('/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg'),
  },
  'pluto-tv': {
    short: 'Pluto',
    label: 'Pluto TV',
    logo: tmdbLogoUrl('/dB8G41Q6tSL5NBisrIeqByfepBc.jpg'),
  },
  mubi: {
    short: 'M',
    label: 'Mubi',
    logo: tmdbLogoUrl('/x570VpH2C9EKDf1riP83rYc5dnL.jpg'),
  },
  clarovideo: {
    short: 'Claro',
    label: 'Claro video',
    logo: tmdbLogoUrl('/21M5CpiOYGOhHj2sVPXqwt6yeTO.jpg'),
  },
};

export const ALL_PLATFORM_IDS = Object.keys(platformMeta);

export const DEFAULT_PLATFORMS = {
  netflix: true,
  hbo: true,
  'disney-plus': true,
  'apple-tv': true,
};

export function normalizePlatforms(stored = {}) {
  return ALL_PLATFORM_IDS.reduce((acc, id) => {
    acc[id] =
      stored[id] !== undefined ? Boolean(stored[id]) : Boolean(DEFAULT_PLATFORMS[id]);
    return acc;
  }, {});
}

export function buildPlatformMetaFromApi(platforms) {
  return (platforms ?? []).reduce((acc, p) => {
    acc[p.slug] = {
      short: p.short_name,
      label: p.name,
      logo: p.logo_url ?? platformMeta[p.slug]?.logo ?? null,
    };
    return acc;
  }, { ...platformMeta });
}
