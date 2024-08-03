import { Body, Controller, Get, Param, Patch, Post, UseFilters, UseGuards } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthUser } from "src/common/decorators/user.decorator";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { JWTAuthGuard } from "src/auth/guard/jwt.guard";
import { EntityNotFoundFilter } from "src/common/filters/entity-not-found-exception.filter";
import { Wish } from "src/wishes/entities/wish.entity";
import { WishesService } from "src/wishes/wishes.service";

@UseGuards(JWTAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private wishesService: WishesService
  ) { }

  @Get('me')
  async findOwn(@AuthUser() user: User): Promise<User> {
    return this.userService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  }

  @Get('me/wishes')
  async findMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.wishesService.findAllByUserId(user.id);
  }

  @Patch('me')
  @UseFilters(EntityNotFoundFilter)
  async updateOne(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const { id } = user;
    return this.userService.update(id, updateUserDto)
  }

  @Get(':username')
  async findByUsername(@Param('username') username: string): Promise<User> {
    return this.userService.findByUsername(username);
  }

  @Get(':username/wishes')
  async findWishesByUsername(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.userService.findByUsername(username);
    return this.wishesService.findAllByUserId(user.id);
  }

  @Post('find')
  async findByQuery(@Body('query') query: string): Promise<User> {
    return this.userService.findByQuery(query);
  }
}