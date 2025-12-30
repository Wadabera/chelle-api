import { ConvertDto } from '../dtos/exchanges.dto';
import { ExchangeRateServices } from './../services/exchanges.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRateServices: ExchangeRateServices) {}
  @Get('daily-rate')
  getDailyRates() {
    return this.exchangeRateServices.fetchDailyRates();
  }
 @Post('conversion')
async convert(@Body() body: ConvertDto) {
  const { amount, from, to } = body;
  return this.exchangeRateServices.convertCurrency(amount, from, to);
}

}
