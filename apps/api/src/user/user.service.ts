import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findAll() {
    return await this.userModel.find();
  }
  async create(userDto: { name: string }) {
    return await this.userModel.create(userDto);
  }
}
