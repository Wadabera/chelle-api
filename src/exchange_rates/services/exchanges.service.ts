import { response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ExchangeRate } from '../schemas/exchange_rates.schema';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { throwError } from 'rxjs';
import { RateConversionDto } from '../dtos/exchanges.dto';
import { RateResponse } from '../responses/exchnages.response';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectModel(ExchangeRate.name)
    readonly rateModel: Model<ExchangeRate>,
    private readonly httpService: HttpService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendRequestAndUpdateRate() {
    try {
      //check  today exchange rate  already exist
      const today = new Date().toISOString().split('T')[0];
      const existingRate = await this.rateModel.findOne({
        exchangeDate: today,
      });
      if (existingRate) {
        console.log(" today's  echange rate already exist");
        return;
      }
      //  if not  exist lets  send  request
      const response = await this.httpService.axiosRef.get(
        `${process.env.EXCHANGE_RATE_API_URL}`,
      );
      if (response.data.result === 'success') {
        const etbToUsd = response.data.conversion_rates.USD;
        const etbToEur = response.data.conversion_rates.EUR;
        const etb = response.data.conversion_rates.ETB;

        //if not create  new rate for today save on database
        const newRate = await this.rateModel.create({
          usdRate: etbToUsd,
          eurRate: etbToEur,
          etbRate: etb,
          exchangeDate: today,
        });
      }
    } catch (error) {
      console.log(error);
      throw new error('faild to fetch exchange rate');
    }
  }
  async getTodayExchangeRate() {
    const today = new Date().toISOString().split('T')[0];
    const todayRate = await this.rateModel.findOne({
    exchangeDate: today
    });
    if(!todayRate) {
    throw new BadRequestException("No rates available for today.")
    }
    const response: RateResponse = {
    id: todayRate.id.toString(),
    usdRate: todayRate.usdRate,
    eurRate: todayRate.eurRate,
    etbRate: todayRate.etbRate,
    exchangeDate: todayRate.exchangeDate
    }
    return response;
    }
  // service for currency conversion
async currencyConversion(rateConversionDto: RateConversionDto) {
  // 1. get today's exchange rate
  const todayRate = await this.getTodayExchangeRate();

  let convertedAmount: number;

  // 2. same currency → no conversion
  if (rateConversionDto.fromCurrency === rateConversionDto.toCurrency) {
    convertedAmount = rateConversionDto.amount;
  }

  // 3. ETB → USD
  else if (
    rateConversionDto.fromCurrency === 'ETB' &&
    rateConversionDto.toCurrency === 'USD'
  ) {
    convertedAmount = rateConversionDto.amount * todayRate.usdRate;
  }

  // 4. ETB → EUR
  else if (
    rateConversionDto.fromCurrency === 'ETB' &&
    rateConversionDto.toCurrency === 'EUR'
  ) {
    convertedAmount = rateConversionDto.amount * todayRate.eurRate;
  }

  // 5. unsupported conversion
  else {
    throw new BadRequestException('Unsupported currency conversion');
  }

  return {
    fromCurrency: rateConversionDto.fromCurrency,
    toCurrency: rateConversionDto.toCurrency,
    amount: convertedAmount,
  };
}

}
