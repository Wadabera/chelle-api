import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { Transaction, transactionSchema } from './schemas/transactions.schema';
import { User, userSchema } from 'src/users/schemas/users.schema';
import { TransactionsService } from './services/transations.service';
import { TransactionController } from './controllers/transations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: transactionSchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
