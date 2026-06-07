import { Injectable, Logger } from '@nestjs/common';
import { resolveTmdbLanguage } from '../common/language.util';
import { TmdbClient } from '../sync/tmdb.client';

export type FormattedMovie = {
  id: number;
  tmdb_id: number;
  slug: string;
  title: string;
  overview: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  age_rating: number | null;
  platform: any;
  trending: boolean;
  badge: string | null;
  popularity_rank: number | null;
  popularity_trend: string | null;
  genres: string[];
  media_type: 'movie' | 'tv';
  runtime: number | null;
  release_year: number | null;
};

type LocalizedFields = Pick<FormattedMovie, 'title' | 'overview' | 'genres'>;

@Injectable()
export class MoviesLocalizationService {
  private readonly logger = new Logger(MoviesLocalizationService.name);
  private readonly cache = new Map<string, LocalizedFields>();

  constructor(private readonly tmdb: TmdbClient) {}

  async localizeMany(movies: FormattedMovie[], appLang?: string): Promise<FormattedMovie[]> {
    const tmdbLang = resolveTmdbLanguage(appLang);
    if (!tmdbLang || movies.length === 0) return movies;

    return Promise.all(movies.map((movie) => this.applyTmdbLanguage(movie, tmdbLang)));
  }

  async localizeOne(movie: FormattedMovie, appLang?: string): Promise<FormattedMovie> {
    const tmdbLang = resolveTmdbLanguage(appLang);
    if (!tmdbLang) return movie;
    return this.applyTmdbLanguage(movie, tmdbLang);
  }

  private async applyTmdbLanguage(movie: FormattedMovie, tmdbLang: string): Promise<FormattedMovie> {
    const cacheKey = `${movie.media_type}:${movie.tmdb_id}:${tmdbLang}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return { ...movie, ...cached };

    try {
      const details =
        movie.media_type === 'tv'
          ? await this.tmdb.getTVDetails(movie.tmdb_id, tmdbLang)
          : await this.tmdb.getMovieDetails(movie.tmdb_id, tmdbLang);

      const localized: LocalizedFields = {
        title: details.title ?? details.name ?? movie.title,
        overview: details.overview ?? movie.overview,
        genres: Array.isArray(details.genres)
          ? details.genres.map((g: { name: string }) => g.name)
          : movie.genres,
      };

      this.cache.set(cacheKey, localized);
      return { ...movie, ...localized };
    } catch (err) {
      this.logger.warn(`No localization for ${movie.tmdb_id} (${tmdbLang}): ${err}`);
      return movie;
    }
  }
}
