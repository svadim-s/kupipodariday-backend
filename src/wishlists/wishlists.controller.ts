import { Controller, Get, Post, Param, Delete, Body, UseGuards, Patch, BadRequestException } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @AuthUser() user) {
    return this.wishlistsService.create(createWishlistDto, user.id);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto, @AuthUser() user) {
    const wishListId = parseInt(id, 10);
    if (isNaN(wishListId)) {
      throw new BadRequestException('Invalid wish ID');
    }
    return this.wishlistsService.update(wishListId, updateWishlistDto, user);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user) {
    const wishListId = parseInt(id, 10);
    if (isNaN(wishListId)) {
      throw new BadRequestException('Invalid wish ID');
    }
    return this.wishlistsService.remove(wishListId, user);
  }
}