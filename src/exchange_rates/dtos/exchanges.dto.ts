import { IsNumber, IsString } from 'class-validator';

export class ConvertDto {
  @IsNumber()
  amount: number;

  @IsString()
  from: string;

  @IsString()
  to: string;
}
