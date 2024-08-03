import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService
  ) {}

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    const owner = await this.usersService.findById(userId)
    const wish = this.wishesRepository.create({ ...createWishDto, owner });
    return this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishesRepository.findOne({ where: { id }, relations: ['owner'] });
  }

  async findAllByUserId(userId: number): Promise<Wish[]> {
    return this.wishesRepository.find({ where: { owner: { id: userId } } });
  }

  async findLastWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { raised: 'DESC' },
      take: 20,
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto, user: User): Promise<Wish> {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('You cannot update someone else\'s wish');
    }

    if (wish.raised > 0 && 'price' in updateWishDto) {
      throw new ForbiddenException('Cannot change the price of a wish with contributions');
    }

    Object.assign(wish, updateWishDto);
    return this.wishesRepository.save(wish);
  }

  async remove(id: number, user: User): Promise<void> {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('You cannot delete someone else\'s wish');
    }

    await this.wishesRepository.remove(wish);
  }

  async copyWish(id: number, userId: number): Promise<Wish> {
    const originalWish = await this.findOne(id);

    if (!originalWish) {
      throw new NotFoundException('Wish not found');
    }

    const owner = await this.usersService.findById(userId);
    const copiedWish = this.wishesRepository.create({
      ...originalWish,
      owner,
      copied: 0,
      raised: 0,
      offers: [],
    });

    const savedWish = await this.wishesRepository.save(copiedWish);
    originalWish.copied++;
    await this.wishesRepository.save(originalWish);

    return savedWish;
  }
}
