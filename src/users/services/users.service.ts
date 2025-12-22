import { TaskService } from './../../tasks/services/tasks.service';
import { UserResponse } from './../responses/users.response';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from '../dtos/users.dto';
import { User } from '../schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { CommonUtils } from '../../commons/utilits';

import { access } from 'fs';
import { response } from 'express';
import { ReferralService } from 'src/referrals/services/referrals.sevice';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,

    private readonly referralService: ReferralService,  // user service know  this  model via user module
    //userModel = the table for Users inside MongoDB
                                                        
  ) {}

  // REGISTER USER***************************************************************************************
  async registerUser(createUserDto: CreateUserDto) {
    console.log('COming request body', createUserDto);
    //1. check if user exists with provided username
    const existingName = await this.userModel.findOne({
      username: createUserDto.username.toLowerCase(),
    });
    console.log('Existing name:', existingName);

    if (existingName) {
      throw new BadRequestException('User already exists with this username.');
    }

    let referringUser = null as any;

    if (createUserDto.referredBy) {
      referringUser = await this.userModel.findOne({
        referralCode: createUserDto.referredBy,
      });

      if (!referringUser) {
        throw new BadRequestException('Invalid referral code.');
      }
    }

    //2. hash password
    const hashedPwd = await bcrypt.hash(createUserDto.password, 10);

    //3. generate refferral
    const referralCode = CommonUtils.generateReferralCode();

    //4. prepare an instance to save on db
    const newUser = new this.userModel({
      fullname: createUserDto.fullname,
      username: createUserDto.username,
      password: hashedPwd,
      referralCode: referralCode,
      referredBy: createUserDto.referredBy || null,
      amount: 100,
      totalEarned: 100,
      totalReferred: 0,
    });

    //5. save to db
    const savedUser = await newUser.save();

    //! We will implement a code to increase amount for referering users
    if (referringUser) {
      await this.referralService.createReferralTracking(
        referringUser._id.toString(),
        savedUser._id.toString(),
      );

      await this.userModel.findByIdAndUpdate(referringUser._id, {
        totalEarned: referringUser.totalEarned + 20,
        amount: referringUser.amount + 20,
        totalReferred: referringUser.totalReferred + 1,
      });
    }

    //6. map to our user response interceptor
    const userResponse: UserResponse = {
      id: savedUser._id.toString(),
      fullname: savedUser.fullname,
      username: savedUser.username,
      referralCode: savedUser.referralCode,
      referredBy: savedUser.referredBy,
      amount: savedUser.amount,
      totalEarned: savedUser.totalEarned,
      totalReferred: savedUser.totalReferred,
    };

    // send back response
    return userResponse;
  }

  //UPDATE  USERS PROFILES***********************************************************************

  async UpdateUserDto(id: string, updateUserDto: UpdateUserDto) {
    // 1️ Check if user exists
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2️ Update only the fields that are sent
    if (updateUserDto.fullname) {
      user.fullname = updateUserDto.fullname;
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    // 3️ Save changes to database
    user.save();

    // 4️ Return updated user
    return {
      message: 'Profile updated successfully',
      user,
    };
  }

  //GET SINGLE PROFILE*****************************************************************************************
  async getUserProfile(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('user dos not exist');
    }
    //if user exists
    const userResponse: UserResponse = {
      id: user._id.toString(),
      fullname: user.fullname,
      username: user.username,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      amount: user.amount,
      totalEarned: user.totalEarned,
      totalReferred: user.totalReferred,
    };
    return userResponse;
  }
  //GET ALL USERS PROFILES***********************************************************************************
  async getAllUsers() {
    const users = await this.userModel.find();
    if (!users || users.length == 0) {
      return [];
    }
    const userResponse: UserResponse[] = users.map((user) => ({
      id: user._id.toString(),
      fullname: user.fullname,
      username: user.username,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      amount: user.amount,
      totalEarned: user.totalEarned,
      totalReferred: user.totalReferred,
    }));
    return userResponse;
  }

  //2.AUTHOUNTHICATION**************************************************************************************

  //login service ised to genatre the token
  async userLogin(userLoginDto: UserLoginDto) {
    //check  user existz
    const user = await this.userModel.findOne({
      username: userLoginDto.username.toLowerCase(),
    });
    if (!user) {
      throw new BadRequestException('invalid user name provided');
    }
    //pasword
    // comparing the pasword
    const isPwMatch = await bcrypt.compare(
      userLoginDto.password,
      user.password,
    );
    if (!isPwMatch) {
      throw new BadRequestException('incorrect password');
    }
    //genarate the token
    const jwtData = {
      id: user._id.toString(),
      fullName: user.fullname,
      username: user.username,
    };
    const genaratedToken = CommonUtils.genarateJwtToken(jwtData);
    console.log('genarated token', genaratedToken);
    return {
      accestoken: genaratedToken,
    };
  }
  //FETCHING  THE REFEREL CODE  FOR THE  USES*****************************************************************
  async getMyreferralCode(currentUser) {
    const user = await this.userModel.findById(currentUser.id);
    if (!user) {
      throw new BadRequestException('user does not exist');
    }
    const userResponse: UserResponse = {
      referralCode: user.referralCode,
    };
    return userResponse;
  }
  //rewward
  async addTaskRewardToUser(currentUserId: string, rewardAmount: number) {
    const user = await this.userModel.findById(currentUserId);
    if (!user) {
      throw new BadRequestException('user is not found');
    }
    user.totalEarned += rewardAmount;
    await user.save();
  }
}
