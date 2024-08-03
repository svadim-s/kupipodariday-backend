import { IsNumber, IsPositive, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
