import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  fullname: string;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  referredBy: string;
  @Prop()
  referralCode: string;
  @Prop()
  amount: number;
  @Prop()
  totalEarned: number;
  @Prop()
  totalReferred: number;
}
export const userSchema = SchemaFactory.createForClass(User);

// export class PROFILE extends Document {
//   @Prop()
//   fullname: string;
//   @Prop()
//   username: string;
//   @Prop()
//   passwrd: string;
// }
// export const getUserProfile = SchemaFactory.createForClass(User);
