import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// TMDB provider_id → our platform slug
export const PROVIDER_MAP: Record<number, string> = {
  8: 'netflix',
  337: 'disney-plus',
  350: 'apple-tv', // Apple TV+ (AR and most regions)
  384: 'hbo', // HBO Max (legacy ID, some regions)
  1899: 'hbo', // HBO Max (AR / LatAm)
  1870: 'hbo', // Max (US)
};

export const SUPPORTED_PROVIDERS = new Set([8, 337, 350, 384, 1899, 1870]);

@Injectable()
export class TmdbClient {
  private readonly logger = new Logger(TmdbClient.name);

  constructor(
    private readonly http: HttpService,
    private readonly cfg: ConfigService,
  ) {}

  private get headers() {
    return { Authorization: `Bearer ${this.cfg.get('TMDB_ACCESS_TOKEN')}` };
  }

  private async get<T>(path: string, params: Record<string, any> = {}): Promise<T> {
    const url = `https://api.themoviedb.org/3${path}`;
    const res = await firstValueFrom(
      this.http.get<T>(url, { headers: this.headers, params }),
    );
    return res.data;
  }

  async getTrending(page = 1): Promise<any[]> {
    const data = await this.get<any>('/trending/all/week', { page, language: 'es-AR' });
    return data.results ?? [];
  }

  async getPopularTV(page = 1): Promise<any[]> {
    const data = await this.get<any>('/tv/popular', { page, language: 'es-AR' });
    return data.results ?? [];
  }

  async getPopularMovies(page = 1): Promise<any[]> {
    const data = await this.get<any>('/movie/popular', { page, language: 'es-AR' });
    return data.results ?? [];
  }

  async discoverByProvider(
    providerId: number,
    mediaType: 'tv' | 'movie',
    page = 1,
    country = 'AR',
  ): Promise<any[]> {
    const data = await this.get<any>(`/discover/${mediaType}`, {
      page,
      language: 'es-AR',
      watch_region: country,
      with_watch_providers: String(providerId),
      sort_by: 'popularity.desc',
    });
    return data.results ?? [];
  }

  async getWatchProviders(tmdbId: number, type: 'tv' | 'movie', country: string): Promise<{ slug: string; providerId: number } | null> {
    try {
      const data = await this.get<any>(`/${type}/${tmdbId}/watch/providers`);
      const region = data.results?.[country];
      const flatrate: any[] = region?.flatrate ?? [];
      for (const p of flatrate) {
        if (SUPPORTED_PROVIDERS.has(p.provider_id)) {
          const slug = PROVIDER_MAP[p.provider_id];
          if (slug) return { slug, providerId: p.provider_id };
        }
      }
    } catch {
      // title not available in country
    }
    return null;
  }

  async getTVDetails(tmdbId: number, language = 'es-AR'): Promise<any> {
    return this.get<any>(`/tv/${tmdbId}`, { language });
  }

  async getMovieDetails(tmdbId: number, language = 'es-AR'): Promise<any> {
    return this.get<any>(`/movie/${tmdbId}`, { language });
  }

  async getTVContentRating(tmdbId: number, country: string): Promise<string | null> {
    try {
      const data = await this.get<any>(`/tv/${tmdbId}/content_ratings`);
      const results: any[] = data.results ?? [];
      const local = results.find((r) => r.iso_3166_1 === country);
      if (local?.rating) return local.rating;
      const us = results.find((r) => r.iso_3166_1 === 'US');
      return us?.rating ?? null;
    } catch {
      return null;
    }
  }

  async getMovieContentRating(tmdbId: number, country: string): Promise<string | null> {
    try {
      const data = await this.get<any>(`/movie/${tmdbId}/release_dates`);
      const results: any[] = data.results ?? [];
      const local = results.find((r) => r.iso_3166_1 === country);
      const cert = local?.release_dates?.[0]?.certification;
      if (cert) return cert;
      const us = results.find((r) => r.iso_3166_1 === 'US');
      return us?.release_dates?.[0]?.certification ?? null;
    } catch {
      return null;
    }
  }

  posterUrl(path: string | null): string | null {
    return path ? `${IMAGE_BASE}${path}` : null;
  }
}

export function toSlug(title: string, tmdbId: number): string {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 200) +
    '-' +
    tmdbId
  );
}

export function certToAgeRating(cert: string | null): number | null {
  if (!cert) return null;
  const map: Record<string, number> = {
    G: 0, TP: 0, ATP: 0,
    PG: 7, '7': 7, 'PG-7': 7, '+7': 7, 'TV-G': 0, 'TV-Y': 0, 'TV-Y7': 7,
    'PG-13': 13, '13': 13, '+13': 13, 'TV-PG': 10, 'TV-14': 14,
    R: 16, '16': 16, '+16': 16,
    'NC-17': 18, '18': 18, '+18': 18, 'TV-MA': 18,
  };
  return map[cert.toUpperCase()] ?? null;
}
