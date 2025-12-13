import { User } from './../schemas/users.schema';
import { JwtStrategy } from './../../commons/guards/jwt.strategy';
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { userService } from '../services/users.service';
import { createUserDto, updateUserDto, userLoginDto } from '../dtos/users.dto';
import { jwtAuthGuard } from 'src/commons/guards/jwtauth.guard';

@Controller('users')
export class usersController {
  constructor(private readonly usersService: userService) {}
  //REGISTER CONTROLLER*******************************************************************************
  @Post('register')
  async createUser(@Body() createUserDto: createUserDto) {
    return await this.usersService.registerUser(createUserDto);
  }

  //UPDATE  CONTROLLER***********************************************************************************
  @Patch('update-profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: updateUserDto,
  ) {
    const result = await this.usersService.updateUser(id, updateUserDto);
    return result;
  }
  //SINGLE PROFILE  CONTEROLLER*****************************************************************************
  @Get('get-profile/:id')
  async getProfile(@Param('id') id: string) {
    const result = await this.usersService.getUserProfile(id);
    return result;
  }
  //GET ALL THE USERS INFORMATION*********************************************************************************

  @jwtAuthGuard()
  @Get('get-all')
  async getAllUsers(@Req() req: any) {
    console.log('Methods:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Query:', req.query);

    console.log('Query:', req.user);
    const result = await this.usersService.getAllUsers();
    return result;
  }
  login;
  @Post('login')
  async userLogin(@Body() userLoginDto: userLoginDto) {
    const result = await this.usersService.userLogin(userLoginDto);
    return result;
  }
  //this is featching the  referall code***************************
  @jwtAuthGuard()
  @Get('get-myreferral-code')
  async getMyReferal(@Req() req: any) {
    console.log('Methods:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Query:', req.query);

    console.log('Currentuser:', req.user);
    const currentUser = req.user;
    const result = await this.usersService.getMyreferralCode(currentUser);
    return result;
  }
}
