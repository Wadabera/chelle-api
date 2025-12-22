import { UsersModule } from './../users/users.module';
import { Controller, forwardRef, Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { Referral, referralSchema } from './schemas/referrals.schema';
import { ReferralService } from './services/referrals.sevice';
import { UserService } from 'src/users/services/users.service';
import { ReferralsController } from './controllers/referrals.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Referral.name,
        schema: referralSchema,
      },
    ]),
  ],
  controllers: [ReferralsController],
  providers: [ReferralService],
})
export class ReferralsModule {}
