import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MoviesQueryDto } from './dto/movies-query.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('trending')
  trending(@Query('lang') lang?: string) {
    return this.moviesService.findTrending(lang);
  }

  @Get('search')
  search(@Query('q') q: string, @Query('lang') lang?: string) {
    return this.moviesService.search(q ?? '', lang);
  }

  @Get('platform/:slug')
  byPlatform(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.moviesService.findByPlatform(slug, lang);
  }

  @Get()
  findAll(@Query() query: MoviesQueryDto, @Query('lang') lang?: string) {
    return this.moviesService.findAll(query, lang);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query('lang') lang?: string) {
    return this.moviesService.findOne(id, lang);
  }
}
