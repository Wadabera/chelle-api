import { types } from 'util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/users.schema';

import { Types, Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Referral extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  referrerId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  referredUserId: Types.ObjectId;
}
export const referralSchema = SchemaFactory.createForClass(Referral);
