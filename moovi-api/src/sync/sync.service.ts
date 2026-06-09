import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from '../movies/movie.entity';
import { PlatformEntity } from '../platforms/platform.entity';
import { TmdbClient, certToAgeRating, toSlug } from './tmdb.client';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(MovieEntity)
    private readonly movies: Repository<MovieEntity>,
    @InjectRepository(PlatformEntity)
    private readonly platforms: Repository<PlatformEntity>,
    private readonly tmdb: TmdbClient,
  ) {}

  async run(country = 'AR'): Promise<{ inserted: number; updated: number; skipped: number }> {
    this.logger.log('Starting TMDB sync...');

    const platformMap = await this.buildPlatformMap();
    const rawItems = await this.fetchAllItems(country);
    this.logger.log(`Fetched ${rawItems.length} unique items from TMDB`);

    // Build trending set with rank
    const trendingIds = new Map<number, number>();
    const trendingRaw = await this.fetchTrendingRaw();
    trendingRaw.forEach((item, idx) => trendingIds.set(item.id, idx + 1));

    const stats = { inserted: 0, updated: 0, skipped: 0 };
    const batches = chunk(rawItems, 10);

    for (const batch of batches) {
      await Promise.all(
        batch.map((item) => this.syncItem(item, trendingIds, platformMap, country, stats)),
      );
      await sleep(300);
    }

    this.logger.log(`Sync complete: ${JSON.stringify(stats)}`);
    return stats;
  }

  private async syncItem(
    item: any,
    trendingIds: Map<number, number>,
    platformMap: Map<string, PlatformEntity>,
    country: string,
    stats: { inserted: number; updated: number; skipped: number },
  ) {
    const mediaType: 'tv' | 'movie' = item.media_type === 'movie' ? 'movie' : 'tv';
    const tmdbId: number = item.id;
    const forcedSlug: string | undefined = item._platformSlug;

    try {
      const provider = forcedSlug
        ? { slug: forcedSlug, providerId: 0 }
        : await this.tmdb.getWatchProviders(tmdbId, mediaType, country);
      if (!provider) {
        stats.skipped++;
        return;
      }

      const platform = platformMap.get(provider.slug);
      if (!platform) {
        stats.skipped++;
        return;
      }

      const [details, certRaw] = await Promise.all([
        mediaType === 'tv' ? this.tmdb.getTVDetails(tmdbId) : this.tmdb.getMovieDetails(tmdbId),
        mediaType === 'tv'
          ? this.tmdb.getTVContentRating(tmdbId, country)
          : this.tmdb.getMovieContentRating(tmdbId, country),
      ]);

      const title: string = details.name ?? details.title ?? 'Sin título';
      const slug = toSlug(title, tmdbId);
      const posterUrl = this.tmdb.posterUrl(details.poster_path);
      const backdropUrl = this.tmdb.posterUrl(details.backdrop_path);
      const genres: string[] = (details.genres ?? []).map((g: any) => g.name);
      const runtime: number | null =
        mediaType === 'movie'
          ? details.runtime ?? null
          : details.episode_run_time?.[0] ?? null;
      const releaseYear: number | null = parseYear(details.first_air_date ?? details.release_date);
      const ageRating = certToAgeRating(certRaw);

      const rankInTrending = trendingIds.get(tmdbId);
      const trending = !!rankInTrending;
      const popularityRank = rankInTrending ?? null;

      let badge: string | null = null;
      if (rankInTrending && rankInTrending <= 10) badge = 'TOP 10';
      else if (!trending && (details.vote_average ?? 0) > 7.5 && (details.vote_count ?? 0) > 1000) badge = 'TENDENCIA';

      // Determine popularity_trend: compare with existing record
      const existing = await this.movies.findOne({ where: { tmdb_id: tmdbId } });
      let popularityTrend: 'up' | 'down' = 'up';
      if (existing) {
        const oldPop = existing.popularity_rank ?? 999;
        const newPop = popularityRank ?? 999;
        popularityTrend = newPop <= oldPop ? 'up' : 'down';
      }

      const data: Partial<MovieEntity> = {
        tmdb_id: tmdbId,
        slug,
        title,
        overview: details.overview ?? undefined,
        poster_url: posterUrl ?? undefined,
        backdrop_url: backdropUrl ?? undefined,
        age_rating: ageRating ?? undefined,
        platform,
        trending,
        badge: badge ?? undefined,
        popularity_rank: popularityRank ?? undefined,
        popularity_trend: popularityTrend,
        genres: genres.length ? JSON.stringify(genres) : undefined,
        media_type: mediaType,
        runtime: runtime ?? undefined,
        release_year: releaseYear ?? undefined,
      };

      if (existing) {
        await this.movies.save({ ...existing, ...data });
        stats.updated++;
      } else {
        await this.movies.save(this.movies.create(data));
        stats.inserted++;
      }
    } catch (err: any) {
      this.logger.warn(`Skipped tmdb_id=${tmdbId}: ${err.message}`);
      stats.skipped++;
    }
  }

  private async fetchTrendingRaw(): Promise<any[]> {
    const pages = await Promise.all([1, 2, 3].map((p) => this.tmdb.getTrending(p)));
    return dedup(pages.flat());
  }

  private async fetchAllItems(country = 'AR'): Promise<any[]> {
    const [t1, t2, t3] = await Promise.all([
      this.tmdb.getTrending(1),
      this.tmdb.getTrending(2),
      this.tmdb.getTrending(3),
    ]);
    const tvPages = await Promise.all([1, 2, 3, 4, 5].map((p) => this.tmdb.getPopularTV(p)));
    const moviePages = await Promise.all([1, 2, 3].map((p) => this.tmdb.getPopularMovies(p)));
    const appleTvTv = await Promise.all(
      [1, 2, 3, 4, 5].map((p) => this.tmdb.discoverByProvider(350, 'tv', p, country)),
    );
    const appleTvMovies = await Promise.all(
      [1, 2, 3].map((p) => this.tmdb.discoverByProvider(350, 'movie', p, country)),
    );
    const hboTv = await Promise.all(
      [1, 2, 3, 4, 5].map((p) => this.tmdb.discoverByProvider(1899, 'tv', p, country)),
    );
    const hboMovies = await Promise.all(
      [1, 2, 3].map((p) => this.tmdb.discoverByProvider(1899, 'movie', p, country)),
    );

    const tag = (items: any[], mediaType: 'tv' | 'movie', platformSlug: string) =>
      items.map((i) => ({ ...i, media_type: mediaType, _platformSlug: platformSlug }));

    const all = [
      ...[...t1, ...t2, ...t3].map((i) => ({ ...i, media_type: i.media_type ?? 'tv' })),
      ...tvPages.flat().map((i) => ({ ...i, media_type: 'tv' })),
      ...moviePages.flat().map((i) => ({ ...i, media_type: 'movie' })),
      ...tag(appleTvTv.flat(), 'tv', 'apple-tv'),
      ...tag(appleTvMovies.flat(), 'movie', 'apple-tv'),
      ...tag(hboTv.flat(), 'tv', 'hbo'),
      ...tag(hboMovies.flat(), 'movie', 'hbo'),
    ];
    return dedup(all);
  }

  private async buildPlatformMap(): Promise<Map<string, PlatformEntity>> {
    const all = await this.platforms.find();
    return new Map(all.map((p) => [p.slug, p]));
  }
}

function dedup(items: any[]): any[] {
  const seen = new Set<number>();
  return items.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseYear(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const y = parseInt(dateStr.substring(0, 4));
  return isNaN(y) ? null : y;
}
