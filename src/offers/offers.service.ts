import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { amount, hidden, itemId } = createOfferDto;

    const wish = await this.wishRepository.findOne({ where: { id: itemId } });
    if (!wish) {
      throw new NotFoundException(`Wish with ID ${itemId} not found`);
    }

    const offer = this.offersRepository.create({
      user,
      wish,
      amount,
      hidden,
    });

    return this.offersRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({ where: { id } });
  }

  async updateOne(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    await this.offersRepository.update(id, updateOfferDto);
    return this.offersRepository.findOne({ where: { id } });
  }

  async removeOne(id: number): Promise<void> {
    await this.offersRepository.delete(id);
  }
}
