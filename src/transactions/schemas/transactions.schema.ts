import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({
    enum: ['ETB', 'USD', 'EUR'],
    default: 'ETB',
  })
  currency: string;

  @Prop()
  status: string;

  @Prop()
  createdAt: Date;
}

export const transactionSchema = SchemaFactory.createForClass(Transaction);
