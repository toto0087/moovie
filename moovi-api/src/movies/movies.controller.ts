import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MoviesQueryDto } from './dto/movies-query.dto';
import { MoviesService } from './movies.service';

// Movie catalog is public — no auth needed to browse
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('trending')
  trending() {
    return this.moviesService.findTrending();
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.moviesService.search(q ?? '');
  }

  @Get('platform/:slug')
  byPlatform(@Param('slug') slug: string) {
    return this.moviesService.findByPlatform(slug);
  }

  @Get()
  findAll(@Query() query: MoviesQueryDto) {
    return this.moviesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }
}
