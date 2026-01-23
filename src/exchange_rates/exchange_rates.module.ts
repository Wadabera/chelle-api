import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {
  ExchangeRate,
  ExchangeRateSchema,
} from './schemas/exchange_rates.schema';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { ExchangeRateService} from './services/exchanges.service';
import { ExchangeRateController } from './controllers/exchanges.conroller';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ExchangeRate.name, schema: ExchangeRateSchema },
    ]),
  ],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService],
})
export class ExchangeRatesModule {}
