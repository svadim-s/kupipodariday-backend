import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from './entity/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: User): Promise<Wishlist> {
    const items = await this.wishesRepository.findBy({ id: In(createWishlistDto.itemsId) });

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      items,
      owner: user,
    });

    return this.wishlistsRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistsRepository.findOne({ where: { id }, relations: ['owner'] });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('You cannot update someone else\'s wishlist');
    }

    Object.assign(wishlist, updateWishlistDto);
    return this.wishlistsRepository.save(wishlist);
  }

  async remove(id: number, user: User): Promise<void> {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('You cannot delete someone else\'s wishlist');
    }

    await this.wishlistsRepository.remove(wishlist);
  }
}