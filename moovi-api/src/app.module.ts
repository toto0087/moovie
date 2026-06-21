import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { PlatformsModule } from './platforms/platforms.module';
import { SyncModule } from './sync/sync.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        // En Render alcanza con pegar la connection string (DATABASE_URL).
        // En local podés usar las variables sueltas DB_HOST/DB_PORT/...
        const url = cfg.get<string>('DATABASE_URL');
        const ssl =
          cfg.get('DB_SSL') === 'true'
            ? { ssl: { rejectUnauthorized: false } }
            : {};
        return {
          type: 'postgres' as const,
          ...(url
            ? { url }
            : {
                host: cfg.get<string>('DB_HOST', 'localhost'),
                port: cfg.get<number>('DB_PORT', 5432),
                username: cfg.get<string>('DB_USER', 'postgres'),
                password: cfg.get<string>('DB_PASSWORD', 'postgres'),
                database: cfg.get<string>('DB_NAME', 'moovi_db'),
              }),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          ...ssl,
        };
      },
    }),
    AuthModule,
    MoviesModule,
    UsersModule,
    PlatformsModule,
    SyncModule,
    ChatbotModule,
  ],
})
export class AppModule {}
