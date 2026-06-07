import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from './movie.entity';
import { MoviesQueryDto } from './dto/movies-query.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly repo: Repository<MovieEntity>,
  ) {}

  async findAll(query: MoviesQueryDto) {
    const { page = 1, limit = 20, tab = 'novedades' } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.platform', 'platform');

    if (tab === 'populares') {
      qb.where('m.trending = :t', { t: true })
        .orderBy('m.popularity_rank', 'ASC');
    } else if (tab === 'recientes') {
      qb.orderBy('m.release_year', 'DESC')
        .addOrderBy('m.created_at', 'DESC');
    } else {
      // novedades
      qb.orderBy('m.created_at', 'DESC');
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data: data.map(this.format), total, page, limit };
  }

  async findTrending() {
    const items = await this.repo.find({
      where: { trending: true },
      relations: { platform: true },
      order: { popularity_rank: 'ASC' },
      take: 20,
    });
    return items.map(this.format);
  }

  async search(q: string) {
    if (!q || q.trim().length < 2) return this.findTrending();

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

    return items.map(this.format);
  }

  async findByPlatform(slug: string) {
    const items = await this.repo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.platform', 'platform')
      .where('platform.slug = :slug', { slug })
      .orderBy('m.popularity_rank', 'ASC')
      .getMany();
    return items.map(this.format);
  }

  async findOne(id: number) {
    const movie = await this.repo.findOne({ where: { id }, relations: { platform: true } });
    if (!movie) throw new NotFoundException('Título no encontrado');
    return this.format(movie);
  }

  private format(m: MovieEntity) {
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
      media_type: m.media_type,
      runtime: m.runtime,
      release_year: m.release_year,
    };
  }
}
