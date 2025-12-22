import mongoose, { Document, Types } from 'mongoose';
//!SCHEMA

import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { ref } from 'process';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop()
  title: string;
  @Prop()
  rewardAmount: number;
  @Prop()
  taskDate: Date;
}
export const taskSchema = SchemaFactory.createForClass(Task);
//!second schema
@Schema({ timestamps: true })
export class UserTask extends Document {
  @Prop()
  userId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Task.name })
  taskId: Types.ObjectId;
  @Prop()
  isCompleted: boolean;
}
export const userTaskSchema = SchemaFactory.createForClass(UserTask);
