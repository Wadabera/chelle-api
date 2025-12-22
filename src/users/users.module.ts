import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './services/users.service';
import { usersController } from './controllers/users.controller';

import { User, userSchema } from './schemas/users.schema';
import { ReferralsModule } from 'src/referrals/referrals.module';
import { ReferralService } from 'src/referrals/services/referrals.sevice';
import {
  Referral,
  referralSchema,
} from 'src/referrals/schemas/referrals.schema';

@Module({
  imports: [
    // Register the User schema with NestJS & MongoDB
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Referral.name, schema: referralSchema },
    ]),
    ReferralsModule, // come from referral module wich exported already
  ],
  providers: [UserService, ReferralService],
  controllers: [usersController],
})
export class UsersModule {}
