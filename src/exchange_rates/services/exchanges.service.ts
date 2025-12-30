import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ExchangeRate,
  ExchangeRateDocument,
} from '../schemas/exchange_rates.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExchangeRateServices {
  private readonly allowedCurrencies = ['ETB', 'USD', 'EUR']; // ✅ Allowed currencies

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(ExchangeRate.name)
    private readonly rateModel: Model<ExchangeRateDocument>,
  ) {}

  // Fetch daily rates from external API and save in DB
  async fetchDailyRates(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.exchangerate-api.com/v4/latest/ETB'),
      );

      const data = response.data;

      // Keep only allowed currencies
      const filteredRates = Object.fromEntries(
        Object.entries(data.rates).filter(([key]) =>
          this.allowedCurrencies.includes(key),
        ),
      );

      // Save in DB
      const newRate = new this.rateModel({
        baseCurrency: data.base,
        rates: new Map(Object.entries(filteredRates)), // convert filtered object to Map
      });
      await newRate.save();

      return { base: data.base, rates: filteredRates };
    } catch (error) {
      throw new BadRequestException('Failed to fetch daily rates');
    }
  }

  // Convert currency using latest rate
  async convertCurrency(
    amount: number,
    from: string,
    to: string,
  ): Promise<number> {
    // ✅ Check if currency is allowed
    if (
      !this.allowedCurrencies.includes(from) ||
      !this.allowedCurrencies.includes(to)
    ) {
      throw new BadRequestException(
        `Currency must be one of: ${this.allowedCurrencies.join(', ')}`,
      );
    }

    // Get the latest rate from DB
    const latestRate = await this.rateModel.findOne().sort({ createdAt: -1 });

    if (!latestRate) {
      throw new BadRequestException('Exchange rate not found');
    }

    // Access Map values using .get()
    const rateFrom = latestRate.rates.get(from);
    const rateTo = latestRate.rates.get(to);

    if (rateFrom === undefined || rateTo === undefined) {
      throw new BadRequestException(
        `Rate for currency ${from} or ${to} not found`,
      );
    }

    // Conversion formula
    const baseAmount = amount / rateFrom; // convert to base currency
    const convertedAmount = baseAmount * rateTo;

    return Number(convertedAmount.toFixed(2)); // round to 2 decimal places
  }
}
