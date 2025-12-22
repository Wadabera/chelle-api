import { User } from './../schemas/users.schema';
import { JwtStrategy } from './../../commons/guards/jwt.strategy';
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { jwtAuthGuard } from 'src/commons/guards/jwtauth.guard';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from '../dtos/users.dto';

@Controller('users')
export class usersController {
  constructor(private readonly usersService: UserService) {}
  //REGISTER CONTROLLER*******************************************************************************
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.registerUser(createUserDto);
  }

  //UPDATE  CONTROLLER***********************************************************************************
  @jwtAuthGuard()
  @Patch('update-profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    console.log('Methods:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Query:', req.query);

    console.log('Currentuser:', req.user);
    const result = await this.usersService.UpdateUserDto(id, updateUserDto);
    return result;
  }
  //SINGLE PROFILE  CONTEROLLER*****************************************************************************
  @jwtAuthGuard()
  @Get('get-profile/:id')
  async getProfile(@Param('id') id: string, @Req() req: any) {
    console.log('Methods:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('Query:', req.query);

    console.log('Currentuser:', req.user);
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
  //LOGIN USER**************************************************************
  @Post('login')
  async userLogin(@Body() UserLoginDto: UserLoginDto) {
    const result = await this.usersService.userLogin(UserLoginDto);
    return result;
  }
  //this is featching the  referall code*********************************
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
