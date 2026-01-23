import { RateConversionDto } from '../dtos/exchanges.dto';
import { ExchangeRateService } from '../services/exchanges.service';
import { ExchangeRate } from './../schemas/exchange_rates.schema';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}
  @Get('today')
  async getTodayRate() {
    return this.exchangeRateService.getTodayExchangeRate();
  }
  @Post('conversion')
async currencyConversion(@Body() dto: RateConversionDto) {
  const result = await this.exchangeRateService.currencyConversion(dto);
  return result;
}

}
