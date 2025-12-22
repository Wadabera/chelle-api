import { TasksController } from './controllers/tasks.controller';
import { TaskService } from './services/tasks.service';
import { User, userSchema } from './../users/schemas/users.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Task,
  taskSchema,
  UserTask,
  userTaskSchema,
} from './schemas/tasks.schema';
import { UserService } from 'src/users/services/users.service';
import {
  Referral,
  referralSchema,
} from 'src/referrals/schemas/referrals.schema';
import { ReferralService } from 'src/referrals/services/referrals.sevice';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: taskSchema },
      { name: UserTask.name, schema: userTaskSchema },
      {name:User.name, schema:userSchema},
      { name: Referral.name, schema: referralSchema },
    ]),
  ],
  providers: [TaskService, UserService, ReferralService],
  controllers: [TasksController],
})
export class TasksModule {}
