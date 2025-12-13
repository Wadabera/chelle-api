import { IsString, IsOptional } from 'class-validator';

// Register DTO
export class createUserDto {
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

export class updateUserDto {
  @IsString()
  @IsOptional()
  fullname: string;

  @IsString()
  @IsOptional()
  username: string;
}
export class userLoginDto {
  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  username: string;
}
