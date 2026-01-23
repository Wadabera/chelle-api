import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ExchangeRate extends Document {
  @Prop({ required: true, default: 'ETB' })
  baseCurrency: string;
  @Prop({ required: true })
  usdRate: number;
  @Prop({ required: true })
  eurRate: number;

  @Prop({ required: true })
  etbRate: number;
  @Prop({ required: true })
  exchangeDate: Date;
}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate);
