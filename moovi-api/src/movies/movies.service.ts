import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MovieEntity } from './movie.entity';
import { MoviesQueryDto } from './dto/movies-query.dto';
import { FormattedMovie, MoviesLocalizationService } from './movies-localization.service';

const SYNCED_PLATFORMS = ['netflix', 'hbo', 'disney-plus', 'apple-tv'] as const;
type MixTab = 'trending' | 'popular' | 'recent';
type MixFilters = { media_type?: string; genre?: string; trendingOnly?: boolean };

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly repo: Repository<MovieEntity>,
    private readonly localization: MoviesLocalizationService,
  ) {}

  async findAll(query: MoviesQueryDto, lang?: string) {
    const page = Number(query.page ?? 1);
    const limit = Math.min(Number(query.limit ?? 10), 50);
    const tab = query.tab ?? 'novedades';
    const { media_type, genre } = query;
    const skip = (page - 1) * limit;

    const mixTab: MixTab =
      tab === 'recientes' ? 'recent' : tab === 'populares' ? 'trending' : 'popular';
    const filters: MixFilters = { media_type, genre };

    const { data, total } = await this.findMixed(mixTab, skip, limit, filters, lang);
    return { data, total, page, limit };
  }

  async getGenres(): Promise<string[]> {
    const rows = await this.repo
      .createQueryBuilder('m')
      .select('m.genres', 'genres')
      .where('m.genres IS NOT NULL AND m.genres != :empty', { empty: '[]' })
      .getRawMany();

    const genreCount = new Map<string, number>();
    for (const row of rows) {
      try {
        const genres = JSON.parse(row.genres);
        if (Array.isArray(genres)) {
          genres.forEach((g: string) => {
            if (g) genreCount.set(g, (genreCount.get(g) ?? 0) + 1);
          });
        }
      } catch {}
    }
    return Array.from(genreCount.entries())
      .filter(([, count]) => count >= 2)
      .map(([genre]) => genre)
      .sort((a, b) => a.localeCompare(b, 'es'));
  }

  async findTrending(lang?: string) {
    const { data } = await this.findMixed('trending', 0, 20, { trendingOnly: true }, lang);
    return data;
  }

  private async findMixed(
    mixTab: MixTab,
    skip: number,
    take: number,
    filters: MixFilters,
    lang?: string,
  ): Promise<{ data: FormattedMovie[]; total: number }> {
    const perPlatform = Math.ceil((skip + take) / SYNCED_PLATFORMS.length) + 1;
    const lists = await Promise.all(
      SYNCED_PLATFORMS.map((slug) => this.fetchPerPlatform(slug, perPlatform, mixTab, filters)),
    );
    const merged = this.interleaveMovies(lists);
    const data = merged.slice(skip, skip + take);
    const counts = await Promise.all(
      SYNCED_PLATFORMS.map((slug) => this.countPerPlatform(slug, filters)),
    );
    const total = counts.reduce((sum, count) => sum + count, 0);
    const movies = await this.localization.localizeMany(data.map((m) => this.format(m)), lang);
    return { data: movies, total };
  }

  private applyMixFilters(qb: SelectQueryBuilder<MovieEntity>, filters: MixFilters) {
    if (filters.media_type) {
      qb.andWhere('m.media_type = :media_type', { media_type: filters.media_type });
    }
    if (filters.genre) {
      qb.andWhere('JSON_CONTAINS(m.genres, :genre)', { genre: JSON.stringify(filters.genre) });
    }
    if (filters.trendingOnly) {
      qb.andWhere('m.trending = :trending', { trending: true });
    }
    return qb;
  }

  private sortMovies(movies: MovieEntity[], mixTab: MixTab): MovieEntity[] {
    return [...movies].sort((a, b) => {
      if (mixTab === 'recent') {
        const yearDiff = (b.release_year ?? 0) - (a.release_year ?? 0);
        if (yearDiff !== 0) return yearDiff;
        return b.created_at.getTime() - a.created_at.getTime();
      }

      const trendingDiff = Number(b.trending) - Number(a.trending);
      if (trendingDiff !== 0) return trendingDiff;

      const rankA = a.popularity_rank ?? 9999;
      const rankB = b.popularity_rank ?? 9999;
      if (rankA !== rankB) return rankA - rankB;

      const yearDiff = (b.release_year ?? 0) - (a.release_year ?? 0);
      if (yearDiff !== 0) return yearDiff;

      return b.created_at.getTime() - a.created_at.getTime();
    });
  }

  private async fetchPerPlatform(
    slug: string,
    take: number,
    mixTab: MixTab,
    filters: MixFilters,
  ): Promise<MovieEntity[]> {
    const qb = this.repo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.platform', 'platform')
      .where('platform.slug = :slug', { slug });
    this.applyMixFilters(qb, filters);
    const items = await qb
      .orderBy('m.trending', 'DESC')
      .addOrderBy('m.release_year', 'DESC')
      .addOrderBy('m.created_at', 'DESC')
      .take(Math.max(take * 8, 40))
      .getMany();
    return this.sortMovies(items, mixTab).slice(0, take);
  }

  private countPerPlatform(slug: string, filters: MixFilters): Promise<number> {
    const qb = this.repo
      .createQueryBuilder('m')
      .leftJoin('m.platform', 'platform')
      .where('platform.slug = :slug', { slug });
    this.applyMixFilters(qb, filters);
    return qb.getCount();
  }

  private interleaveMovies(platformMovies: MovieEntity[][]): MovieEntity[] {
    const maxLen = Math.max(0, ...platformMovies.map((list) => list.length));
    const merged: MovieEntity[] = [];
    for (let i = 0; i < maxLen; i++) {
      for (const list of platformMovies) {
        if (list[i]) merged.push(list[i]);
      }
    }
    return merged;
  }

  async search(q: string, lang?: string) {
    if (!q || q.trim().length < 2) return this.findTrending(lang);

    const term = q.trim();
    const items = await this.repo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.platform', 'platform')
      .where(
        `MATCH(m.title, m.overview) AGAINST (:term IN BOOLEAN MODE)`,
        { term: `${term}*` },
      )
      .orWhere('m.title LIKE :like', { like: `%${term}%` })
      .orWhere('m.genres LIKE :like', { like: `%${term}%` })
      .orderBy('m.popularity_rank', 'ASC')
      .limit(50)
      .getMany();

    return this.localization.localizeMany(items.map((m) => this.format(m)), lang);
  }

  async findByPlatform(slug: string, lang?: string) {
    const items = await this.repo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.platform', 'platform')
      .where('platform.slug = :slug', { slug })
      .orderBy('m.popularity_rank', 'ASC')
      .getMany();
    return this.localization.localizeMany(items.map((m) => this.format(m)), lang);
  }

  async findOne(id: number, lang?: string) {
    const movie = await this.repo.findOne({ where: { id }, relations: { platform: true } });
    if (!movie) throw new NotFoundException('Título no encontrado');
    return this.localization.localizeOne(this.format(movie), lang);
  }

  format(m: MovieEntity): FormattedMovie {
    return {
      id: m.id,
      tmdb_id: m.tmdb_id,
      slug: m.slug,
      title: m.title,
      overview: m.overview,
      poster_url: m.poster_url,
      backdrop_url: m.backdrop_url,
      age_rating: m.age_rating,
      platform: m.platform
        ? {
            id: m.platform.id,
            slug: m.platform.slug,
            name: m.platform.name,
            short_name: m.platform.short_name,
            color: m.platform.color,
            logo_url: m.platform.logo_url,
          }
        : null,
      trending: m.trending,
      badge: m.badge,
      popularity_rank: m.popularity_rank,
      popularity_trend: m.popularity_trend,
      genres: (() => { try { return m.genres ? JSON.parse(m.genres) : []; } catch { return []; } })(),
      media_type: m.media_type as 'movie' | 'tv',
      runtime: m.runtime,
      release_year: m.release_year,
    };
  }
}
