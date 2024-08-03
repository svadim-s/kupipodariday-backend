import { MinLength } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entity/wishlist.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { Wish } from '../../wishes/entities/wish.entity';
// import { Offer } from '../../offers/entities/offer.entity';
// import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  username: string;

  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @OneToMany(() => Wish, wish => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, wishlist => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, offer => offer.user)
  offers: Offer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
