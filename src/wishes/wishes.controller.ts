import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Patch, BadRequestException } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @Get('/last')
  getLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('/top')
  getTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto, @AuthUser() user) {
    const wishId = parseInt(id, 10);
    if (isNaN(wishId)) {
      throw new BadRequestException('Invalid wish ID');
    }
    return this.wishesService.update(wishId, updateWishDto, user);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user) {
    const wishId = parseInt(id, 10);
    if (isNaN(wishId)) {
      throw new BadRequestException('Invalid wish ID');
    }
    return this.wishesService.remove(wishId, user);
  }

  @UseGuards(JWTAuthGuard)
  @Post('/:id/copy')
  copyWish(@Param('id') id: string, @AuthUser() user) {
    const wishId = parseInt(id, 10);
    if (isNaN(wishId)) {
      throw new BadRequestException('Invalid wish ID');
    }
    return this.wishesService.copyWish(wishId, user.id);
  }
}