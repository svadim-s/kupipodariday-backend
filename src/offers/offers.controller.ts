import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';

@UseGuards(JWTAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user) {
    return this.offersService.create(createOfferDto, user.id);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}