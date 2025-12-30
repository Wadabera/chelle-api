import { IsNumber, IsString, Max, Min } from 'class-validator';

export class TransferTdo {
  @IsString()
  receiverUsername: string;
  @IsNumber()
  @Min(10, { message: 'minimum  amount' })
  @Max(150, { message: 'max amount' })
  amount: number;
}
