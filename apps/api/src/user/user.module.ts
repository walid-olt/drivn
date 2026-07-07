import { Module } from '@nestjs/common';
import { User, userScheme } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userScheme }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
