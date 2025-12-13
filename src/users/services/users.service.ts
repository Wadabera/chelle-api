import { UserResponse } from './../responses/users.response';
import { BadRequestException, Injectable, Patch } from '@nestjs/common';
import { createUserDto, updateUserDto, userLoginDto } from '../dtos/users.dto';
import { User } from '../schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { CommonUtils } from '../../commons/utilits';

import { access } from 'fs';
import { response } from 'express';

@Injectable()
export class userService {
  constructor(
    @InjectModel(User.name) //NestJS, please give me the Mongoose model for the 'User' collection.
    private readonly userModel: Model<User>, //userModel = the table for Users inside MongoDB
  ) {}

  // REGISTER USER***************************************************************************************
  async registerUser(createUserDto: createUserDto) {
    //. all logics will  be done here

    //1.check if user exists
    const existingName = await this.userModel.findOne({
      username: createUserDto.username.toLowerCase(),
    });

    console.log('existing name', existingName);

    if (existingName) {
      throw new Error('Username already exists');
    }

    //2.hash password
    const hashedpwd = await bcrypt.hash(createUserDto.password, 10);

    //3.generate referral
    const referralCode = CommonUtils.generateReferralCode();

    //4. update referring user if exists
    if (createUserDto.referredBy) {
      const referringUser = await this.userModel.findOne({
        referralCode: createUserDto.referredBy,
      });

      if (referringUser) {
        await this.userModel.findByIdAndUpdate(referringUser._id, {
          totalEarned: referringUser.totalEarned + 20,
          amount: referringUser.amount + 20,
          totalReferred: referringUser.totalReferred + 1,
        });
      }
    }

    //5.prepare an instance to save on db
    const sevedUser = new this.userModel({
      fullname: createUserDto.fullname,
      username: createUserDto.username.toLowerCase(),
      password: hashedpwd,
      referredBy: createUserDto.referredBy || null,
      referralCode: referralCode,
      amount: 0,
      totalEarned: 0,
      totalReferred: 0,
    });

    //6.save to db
    await sevedUser.save();

    //7.map to response
    const userResponse: UserResponse = {
      id: sevedUser._id.toString(),
      fullname: sevedUser.fullname,
      username: sevedUser.username,
      referralCode: sevedUser.referralCode,
      referredBy: sevedUser.referredBy,
      amount: sevedUser.amount,
      totalEarned: sevedUser.totalEarned,
      totalReferred: sevedUser.totalReferred,
    };

    //8.return response
    return userResponse;
  }
  //UPDATE THE USER SERVICE************************************************************************************
  async updateUser(id: string, updateUserDto: updateUserDto) {
    //chack user table
    const user = await this.userModel.findById(id);
    if (!user) {
      {
        throw new BadRequestException('user dos not exist');
      }
    }
    //preparing thing
    if (updateUserDto.fullname) {
      user.fullname = updateUserDto.fullname;
    }
    //check if username is exist with provided user name
    if (updateUserDto.username) {
      const existUsername = await this.userModel.findOne({
        username: updateUserDto.username.toLowerCase(),
      });
      if (existUsername && existUsername.username !== user.username) {
        throw new BadRequestException('username already exist');
      }
      user.username = updateUserDto.username.toLowerCase();
    }

    //update username
    //save to db
    const updatedUser = await user.save();
    //map to response
    const userResponse: UserResponse = {
      id: updatedUser._id.toString(),
      fullname: updatedUser.fullname,
      username: updatedUser.username,
      referralCode: updatedUser.referralCode,
      referredBy: updatedUser.referredBy,
      amount: updatedUser.amount,
      totalEarned: updatedUser.totalEarned,
      totalReferred: updatedUser.totalReferred,
    };
    //return response
    return userResponse;
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
  //GET ALL USERS PROFILES*************************************************************************
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

  //2.AUTHOUNTHICATION********************************************************************************

  //login service ised to genatre the token
  async userLogin(userLoginDto: userLoginDto) {
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
  //FETCHING  THE REFEREL CODE  FOR THE  USES***********************************
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
}
