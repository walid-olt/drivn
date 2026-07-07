import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/')
  async createUser(@Body() userDto: { name: string }) {
    if (!userDto?.name) throw new BadRequestException('name required');
    return await this.userService.create(userDto);
  }
}
