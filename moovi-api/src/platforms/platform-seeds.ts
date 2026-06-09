export type PlatformSeed = {
  slug: string;
  name: string;
  short_name: string;
  color: string;
  logo_url: string;
};

export const PLATFORM_SEEDS: PlatformSeed[] = [
  {
    slug: 'netflix',
    name: 'Netflix',
    short_name: 'N',
    color: '#E50914',
    logo_url: 'https://image.tmdb.org/t/p/w92/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
  },
  {
    slug: 'hbo',
    name: 'HBO Max',
    short_name: 'HBO',
    color: '#5822B4',
    logo_url: 'https://image.tmdb.org/t/p/w92/jbe4gVSfRlbPTdESXhEKpornsfu.jpg',
  },
  {
    slug: 'disney-plus',
    name: 'Disney+',
    short_name: 'D+',
    color: '#0063E5',
    logo_url: 'https://image.tmdb.org/t/p/w92/97yvRBw1GzX7fXprcF80er19ot.jpg',
  },
  {
    slug: 'apple-tv',
    name: 'Apple TV+',
    short_name: 'TV+',
    color: '#1D1D1F',
    logo_url: 'https://image.tmdb.org/t/p/w92/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg',
  },
  {
    slug: 'amazon-prime',
    name: 'Prime Video',
    short_name: 'Prime',
    color: '#00A8E1',
    logo_url: 'https://image.tmdb.org/t/p/w92/pvske1MyAoymrs5bguRfVqYiM9a.jpg',
  },
  {
    slug: 'paramount-plus',
    name: 'Paramount+',
    short_name: 'P+',
    color: '#0064FF',
    logo_url: 'https://image.tmdb.org/t/p/w92/h5DcR0J2EESLitnhR8xLG1QymTE.jpg',
  },
  {
    slug: 'star-plus',
    name: 'Star+',
    short_name: 'S+',
    color: '#E50914',
    logo_url: 'https://image.tmdb.org/t/p/w92/hR9vWd8hWEVQKD6eOnBneKRFEW3.jpg',
  },
  {
    slug: 'crunchyroll',
    name: 'Crunchyroll',
    short_name: 'CR',
    color: '#F47521',
    logo_url: 'https://image.tmdb.org/t/p/w92/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg',
  },
  {
    slug: 'pluto-tv',
    name: 'Pluto TV',
    short_name: 'Pluto',
    color: '#FFD500',
    logo_url: 'https://image.tmdb.org/t/p/w92/dB8G41Q6tSL5NBisrIeqByfepBc.jpg',
  },
  {
    slug: 'mubi',
    name: 'Mubi',
    short_name: 'M',
    color: '#001489',
    logo_url: 'https://image.tmdb.org/t/p/w92/x570VpH2C9EKDf1riP83rYc5dnL.jpg',
  },
  {
    slug: 'clarovideo',
    name: 'Claro video',
    short_name: 'Claro',
    color: '#E30613',
    logo_url: 'https://image.tmdb.org/t/p/w92/21M5CpiOYGOhHj2sVPXqwt6yeTO.jpg',
  },
];

export const SYNCED_PLATFORM_SLUGS = PLATFORM_SEEDS.map((p) => p.slug);

/** Primary TMDB provider id per platform for discover sync (AR/LatAm). */
export const DISCOVER_PROVIDERS: { slug: string; providerId: number; tvPages: number; moviePages: number }[] = [
  { slug: 'netflix', providerId: 8, tvPages: 5, moviePages: 3 },
  { slug: 'disney-plus', providerId: 337, tvPages: 5, moviePages: 3 },
  { slug: 'apple-tv', providerId: 350, tvPages: 5, moviePages: 3 },
  { slug: 'hbo', providerId: 1899, tvPages: 5, moviePages: 3 },
  { slug: 'amazon-prime', providerId: 119, tvPages: 4, moviePages: 3 },
  { slug: 'paramount-plus', providerId: 531, tvPages: 4, moviePages: 2 },
  { slug: 'star-plus', providerId: 619, tvPages: 4, moviePages: 2 },
  { slug: 'crunchyroll', providerId: 283, tvPages: 3, moviePages: 1 },
  { slug: 'pluto-tv', providerId: 300, tvPages: 3, moviePages: 1 },
  { slug: 'mubi', providerId: 11, tvPages: 2, moviePages: 1 },
  { slug: 'clarovideo', providerId: 167, tvPages: 2, moviePages: 1 },
];
