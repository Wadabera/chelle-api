import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExchangeRateDocument = ExchangeRate & Document;

@Schema({ timestamps: true })
export class ExchangeRate {
  @Prop({ required: true })
  baseCurrency: string;

  @Prop({ type: Map, of: Number, required: true })
  rates: Map<string, number>;
}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate);
