import { ReferredUsersResponse } from './../responses/referrals.response';
import { UserService } from 'src/users/services/users.service';
import { ReferralsModule } from '../referrals.module';

import {
  BadGatewayException,
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Referral } from '../schemas/referrals.schema';
import { Model, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { ReferrerResponse } from '../responses/referrals.response';

@Injectable()
export class ReferralService {
  constructor(
    @InjectModel(Referral.name)
    private readonly referralsModel: Model<Referral>,
    //I want a tool to access the Referral collection in MongoDB, and I’ll call it as referralsModule inside this service
  ) {}

  async createReferralTracking(referrerId: string, referredUserId: string) {
    //prevent self  referrer
    if (referrerId == referredUserId) {
      throw new BadGatewayException('impossible to self referred');
    }
    //prevent duplicate referrals
    const refExists = await this.referralsModel.exists({
      referredUserId: referredUserId,
    });
    if (refExists) {
      throw new BadRequestException('user allredy exist referred');
    }
    const referral = await this.referralsModel.create({
      referrerId: new Types.ObjectId(referrerId),
      referredUserId: new Types.ObjectId(referredUserId),
    });
    return referral.save();
  }
  //going to gate my refereer  or Tell me who invited me****************************
  async getMyreferrer(currentUser) {
    const referral = await this.referralsModel
      .findOne({ referredUserId: new Types.ObjectId(currentUser.id) })
      .populate('referrerId', 'username fullname createdAt');

    if (!referral) {
      throw new BadGatewayException('you dont have the referer');
    }
    const referrer = referral.referrerId as any;
    console.log('referrer found ', referrer);

    /// user interceptr
    const referrerResponse: ReferrerResponse = {
      referrarId: referrer?._id.toString(),
      referrerfullname: referrer?.fullname,
      referrarUsername: referrer?.username,
    };
    return referrerResponse;
  }
  //going to gate  all users who regsterd by my referal code*****************************
  async getMyRefferedUsers(currentUser) {

    
    const referrals = await this.referralsModel
      .find({ referrerId: new Types.ObjectId(currentUser.id) }) // use correct field
      .populate('referredUserId', 'username fullname createdAt');
    if (referrals.length == 0) {
      return [];
    }
    const referredresponse: ReferredUsersResponse[] = referrals.map(
      (referral) => {
        const referredUser = referral.referredUserId as any;
        return {
          id: referral._id.toString(),
          referredUserId: referredUser?._id.toString(),
          referredUserFullName: referredUser?.fullname,
          referredUserUsername: referredUser?.username,
        };
      },
    );
    return referredresponse;
  }
}
