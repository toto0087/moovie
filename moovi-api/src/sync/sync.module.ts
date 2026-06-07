import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MovieEntity } from '../movies/movie.entity';
import { PlatformEntity } from '../platforms/platform.entity';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { TmdbClient } from './tmdb.client';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([MovieEntity, PlatformEntity]),
    AuthModule,
  ],
  controllers: [SyncController],
  providers: [SyncService, TmdbClient],
  exports: [SyncService],
})
export class SyncModule {}
