import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Put('me')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('me/list')
  getList(@CurrentUser() user: any, @Query('lang') lang?: string) {
    return this.usersService.getListDirect(user.id, lang);
  }

  @Post('me/list/:movieId')
  addToList(@CurrentUser() user: any, @Param('movieId', ParseIntPipe) movieId: number) {
    return this.usersService.addToList(user.id, movieId);
  }

  @Delete('me/list/:movieId')
  removeFromList(@CurrentUser() user: any, @Param('movieId', ParseIntPipe) movieId: number) {
    return this.usersService.removeFromList(user.id, movieId);
  }
}
