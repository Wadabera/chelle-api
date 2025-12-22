import { IsString, IsOptional } from 'class-validator';

// Register DTO
export class CreateUserDto {
  @IsString()
  fullname: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  referral: string;

  @IsString()
  @IsOptional()
  referredBy: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullname: string;

  @IsString()
  @IsOptional()
  username: string;
}
export class UserLoginDto {
  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  username: string;
}
