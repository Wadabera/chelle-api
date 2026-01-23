import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './commons/guards/jwt.strategy';

import { UsersModule } from './users/users.module';
import { ReferralsModule } from './referrals/referrals.module';
import { TasksModule } from './tasks/tasks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ExchangeRatesModule } from './exchange_rates/exchange_rates.module';

@Module({
  imports: [
    // 1️⃣ Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2️⃣ Inject MongoDB URI from .env
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    // 3️⃣ Enable background jobs / cron tasks
    ScheduleModule.forRoot(),

    // 4️⃣ Feature modules
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
