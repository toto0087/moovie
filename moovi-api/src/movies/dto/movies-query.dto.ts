import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class MoviesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['novedades', 'recientes', 'populares'])
  tab?: string = 'novedades';

  @IsOptional()
  @IsEnum(['movie', 'tv'])
  media_type?: 'movie' | 'tv';

  @IsOptional()
  @IsString()
  genre?: string;
}
