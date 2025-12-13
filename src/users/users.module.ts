import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { userService } from './services/users.service';
import { usersController } from './controllers/users.controller';

import { User, userSchema } from './schemas/users.schema';

@Module({
  imports: [
    // Register the User schema with NestJS & MongoDB
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  providers: [userService],
  controllers: [usersController],
})
export class UsersModule {}
