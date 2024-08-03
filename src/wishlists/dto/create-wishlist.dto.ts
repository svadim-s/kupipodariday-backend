import { IsString, IsNotEmpty, Length, IsUrl, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  itemsId: number[];
}
