import { response } from 'express';
import { TransferTdo } from './../dtos/transations.dto';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../schemas/transactions.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { TransactionResponse } from '../responses/transactions.response';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async makeTransfer(currentUser: any, transferTdo: TransferTdo) {
    //1.check if reciever exist
    const receiver = await this.userModel.findOne({
      username: transferTdo.receiverUsername,
    });
    if (!receiver) {
      throw new BadGatewayException('receiver not found');
    }
    //2.check if sender exist
    const sender = await this.userModel.findById(currentUser.id);
    if (!sender) {
      throw new BadGatewayException('sender is not  found');
    }
    //3.prevent self transfer
    if (receiver._id.toString() === sender._id.toString()) {
      throw new BadGatewayException('you cannot transfer to your self');
    }
    //4.check if sender unsufficent balance
    if (sender.totalEarned < transferTdo.amount) {
      throw new BadGatewayException('you have insufficient balance');
    }
    //5.deduct amount from sender
    sender.totalEarned -= transferTdo.amount;
    await sender.save();
    //6.deduct anount of receiver
    receiver.totalEarned += transferTdo.amount;
    await receiver.save();
    //7.creating transaction instance
    const newTransaction = await this.transactionModel.create({
      senderId: sender._id,
      receiverId: receiver._id,
      amount: transferTdo.amount,
      status: 'COMPLETED',
    });
    //8.saving instance
    const savedTransaction = await newTransaction.save();
    //9.returning using our intercepter responser
    const response: TransactionResponse = {
      id: savedTransaction._id.toString(),
      senderFullName: sender.fullname,
      senderUsername: sender.username,
      receiverFullName: receiver.fullname,
      receiverUsername: receiver.username,
      amount: savedTransaction.amount,
      currency: savedTransaction.currency,
      status: savedTransaction.status,
      createdAt: savedTransaction.createdAt,
    };
    return response;
  }
  //feching user history
  async getUserTransactions(currentUser) {
    const transactions = await this.transactionModel
      .find({
        $or: [
          { senderId: new Types.ObjectId(currentUser.id) },
          { receiverId: new Types.ObjectId(currentUser.id) }
        ],
      })
      .populate('senderId', 'fullname username')
      .populate('receiverId', 'fullname username');
    const response: TransactionResponse[] = transactions.map((history) => {
      const senderUser = history.senderId as any;
      const receiverUser = history.receiverId as any;

      return {
        id: history._id.toString(),
        senderFullName: senderUser.fullname,
        receiverFullName: receiverUser.fullname,
        senderUsername: senderUser.username,
        receiverUsername: receiverUser.username,
        amount: history.amount,
        currency: history.currency,
        status: history.status,
        createdAt: history.createdAt, 
      }
    });

    return response;
  }
}
