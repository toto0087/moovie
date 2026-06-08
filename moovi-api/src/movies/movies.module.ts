import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SyncModule } from '../sync/sync.module';
import { MovieEntity } from './movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesLocalizationService } from './movies-localization.service';
import { MoviesService } from './movies.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), AuthModule, SyncModule],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesLocalizationService],
  exports: [MoviesService, MoviesLocalizationService],
})
export class MoviesModule {}
