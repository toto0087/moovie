import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { MoviesLocalizationService } from '../movies/movies-localization.service';
import { MoviesService } from '../movies/movies.service';
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
    private readonly moviesService: MoviesService,
    private readonly localization: MoviesLocalizationService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const { password_hash, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const updates: Partial<UserEntity> = {};

    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.country !== undefined) updates.country = dto.country;
    if (dto.avatar_url !== undefined) updates.avatar_url = dto.avatar_url;
    if (dto.plan !== undefined) updates.plan = dto.plan;

    if (dto.email !== undefined && dto.email !== user.email) {
      const existing = await this.users.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('El email ya está registrado');
      updates.email = dto.email;
    }

    if (dto.new_password !== undefined) {
      if (!dto.current_password) {
        throw new BadRequestException('La contraseña actual es requerida');
      }
      const match = await bcrypt.compare(dto.current_password, user.password_hash);
      if (!match) throw new UnauthorizedException('Contraseña actual incorrecta');
      updates.password_hash = await bcrypt.hash(dto.new_password, 10);
    }

    if (Object.keys(updates).length === 0) {
      return this.getProfile(userId);
    }

    await this.users.update(userId, updates);
    return this.getProfile(userId);
  }

  async getListDirect(userId: number, lang?: string) {
    const rows = await this.movies
      .createQueryBuilder('m')
      .innerJoin('user_lists', 'ul', 'ul.movie_id = m.id AND ul.user_id = :userId', { userId })
      .leftJoinAndSelect('m.platform', 'platform')
      .orderBy('ul.added_at', 'DESC')
      .getMany();

    const formatted = rows.map((m) => this.moviesService.format(m));
    return this.localization.localizeMany(formatted, lang);
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
}
