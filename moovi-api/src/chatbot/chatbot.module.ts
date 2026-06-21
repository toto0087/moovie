import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MoviesModule } from '../movies/movies.module';
import { MovieEntity } from '../movies/movie.entity';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { GeminiClient } from './gemini.client';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    MoviesModule,
    TypeOrmModule.forFeature([MovieEntity]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, GeminiClient],
})
export class ChatbotModule {}
