import { TransactionsService } from './../services/transations.service';
import { User } from './../../users/schemas/users.schema';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { TransferTdo } from '../dtos/transations.dto';
import { jwtAuthGuard } from 'src/commons/guards/jwtauth.guard';


@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionsService) { }
  //transfer money*************************************
  @jwtAuthGuard()
  @Post('transfer')
  async transferMoney(@Req() req: any, @Body() transferDto: TransferTdo) {
    const currentUser = req.user;
    return this.transactionService.makeTransfer(currentUser, transferDto);
  }
  
// users get  their history**************************
  @jwtAuthGuard()
  @Get('my-history')
  async getUserTransacions(@Req() req: any) {
    const currentUser = req.user;
    return this.transactionService.getUserTransactions(currentUser);
  }
}


