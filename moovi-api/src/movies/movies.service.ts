import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from './movie.entity';
import { MoviesQueryDto } from './dto/movies-query.dto';
import { FormattedMovie, MoviesLocalizationService } from './movies-localization.service';

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

    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.platform', 'platform');

    if (media_type) {
      qb.andWhere('m.media_type = :media_type', { media_type });
    }

    if (genre) {
      qb.andWhere('JSON_CONTAINS(m.genres, :genre)', { genre: JSON.stringify(genre) });
    }

    if (tab === 'populares') {
      qb.andWhere('m.trending = :t', { t: true })
        .orderBy('m.popularity_rank', 'ASC');
    } else if (tab === 'recientes') {
      qb.orderBy('m.release_year', 'DESC')
        .addOrderBy('m.created_at', 'DESC');
    } else {
      qb.orderBy('m.created_at', 'DESC');
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    const movies = await this.localization.localizeMany(data.map((m) => this.format(m)), lang);
    return { data: movies, total, page, limit };
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
    const items = await this.repo.find({
      where: { trending: true },
      relations: { platform: true },
      order: { popularity_rank: 'ASC' },
      take: 20,
    });
    return this.localization.localizeMany(items.map((m) => this.format(m)), lang);
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
        ? { id: m.platform.id, slug: m.platform.slug, name: m.platform.name, short_name: m.platform.short_name, color: m.platform.color }
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
