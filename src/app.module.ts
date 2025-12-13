import { JwtStrategy } from './commons/guards/jwt.strategy';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReferralsModule } from './referrals/referrals.module';
import { TasksModule } from './tasks/tasks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ExchangeRatesModule } from './exchange_rates/exchange_rates.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'process';
import { ConfigModule } from '@nestjs/config';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://waadaa:091234@challa.pa74p3u.mongodb.net/chella_db?retryWrites=true&w=majority',
    ),

    //process.enve is come from the  dependancy   wee instailled  it

    UsersModule,
    ReferralsModule,
    TasksModule,
    TransactionsModule,
    ExchangeRatesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
