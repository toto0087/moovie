import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from '../movies/movie.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(MovieEntity)
    private readonly movies: Repository<MovieEntity>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const { password_hash, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    await this.users.update(userId, dto);
    return this.getProfile(userId);
  }

  async getListDirect(userId: number) {
    const rows = await this.movies
      .createQueryBuilder('m')
      .innerJoin('user_lists', 'ul', 'ul.movie_id = m.id AND ul.user_id = :userId', { userId })
      .leftJoinAndSelect('m.platform', 'platform')
      .orderBy('ul.added_at', 'DESC')
      .getMany();

    return rows.map(this.formatMovie);
  }

  async addToList(userId: number, movieId: number) {
    const movie = await this.movies.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Título no encontrado');

    await this.users.manager.query(
      'INSERT IGNORE INTO user_lists (user_id, movie_id) VALUES (?, ?)',
      [userId, movieId],
    );
    return { added: true };
  }

  async removeFromList(userId: number, movieId: number) {
    await this.users.manager.query(
      'DELETE FROM user_lists WHERE user_id = ? AND movie_id = ?',
      [userId, movieId],
    );
    return { removed: true };
  }

  private formatMovie(m: MovieEntity) {
    return {
      id: m.id,
      tmdb_id: m.tmdb_id,
      slug: m.slug,
      title: m.title,
      overview: m.overview,
      poster_url: m.poster_url,
      backdrop_url: m.backdrop_url,
      age_rating: m.age_rating ?? null,
      platform: m.platform
        ? { id: m.platform.id, slug: m.platform.slug, name: m.platform.name, short_name: m.platform.short_name, color: m.platform.color }
        : null,
      trending: m.trending,
      badge: m.badge ?? null,
      popularity_rank: m.popularity_rank ?? null,
      popularity_trend: m.popularity_trend ?? null,
      genres: (() => {
        try { return m.genres ? JSON.parse(m.genres) : []; } catch { return []; }
      })(),
      media_type: m.media_type,
      runtime: m.runtime ?? null,
      release_year: m.release_year ?? null,
    };
  }
}
