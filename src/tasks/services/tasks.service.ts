import { UserService } from 'src/users/services/users.service';
import { UserTask } from './../schemas/tasks.schema';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../schemas/tasks.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskResponse } from '../response/tasks.responses';
import { title } from 'process';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly TaskModel: Model<Task>,
    @InjectModel(UserTask.name) private readonly userTaskModel: Model<UserTask>,
    private readonly userService: UserService,
  ) {}
  //background job  to create the daily task
  @Cron(CronExpression.EVERY_5_MINUTES)
  async createDailyTasks() {
    console.log('hey we  are running att 10 mimityus');
    const today = new Date().toISOString().split('T')[0];
    //1 count todays task
    const taskCount = await this.TaskModel.countDocuments({
      taskDate: today,
    });
    if (taskCount >= 5) {
      console.log('today task is allready created');
      return;
    }
    //2 let's manage in case of server down and created only missing tasks
    const tasksToCreate = 5 - taskCount;
    //3 create task
    for (let i = 0; i < tasksToCreate; i++) {
      const newTask = new this.TaskModel({
        title: `daily task ${taskCount + i + 1}`,
        rewardAmount: 10,
        taskDate: today,
      });
      await newTask.save();
    }
    console.log(`${tasksToCreate} task is  craeted for today`);
  }
  //fetch daily task
  async getDailyTasks() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = await this.TaskModel.find({
      taskDate: today,
    });
    const response: TaskResponse[] = todayTasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      rewardAmount: task.rewardAmount,
      taskDate: task.taskDate,
    }));

    return response;
  }
  
  async completeTask(currentUser, taskId: string) {
    //lets check if task is exist
    const task = await this.TaskModel.findById(taskId);
    if (!task) {
      throw new BadRequestException('task is not found');
    }
    //lets chek existance of current user task completed
    const alreadyCompletedExistes = await this.userTaskModel.exists({
      userId: currentUser.id,
      taskId: taskId,
    });
    if (alreadyCompletedExistes) {
      throw new BadRequestException('task already completed');
    }
    //creating new task  istance and seving
    const userTask = await this.userTaskModel.create({
      userId: currentUser.id,
      taskId: taskId,
      isCompleted: true,
    });
    //fetch completed task
    const savedUserTask = await this.userService.addTaskRewardToUser(
      currentUser.id,
      task.rewardAmount,
    );
    //user interceptora nd response back
    const response: TaskResponse = {
      id: task._id.toString(),
      rewardAmount: task?.rewardAmount,
      taskDate: task?.taskDate,
    };
    return response;
  }
  //service fetch cmpletd task by current user
  async getUserCompletedTasks(currentUser) {
    //get user completed task from user task collection
    const userTasks = await this.userTaskModel.find({
      userId: currentUser.id,
      isCompleted: true,
    });
    const taskIds = userTasks.map((userTask) => userTask.taskId);
    const tasks = await this.TaskModel.find({
      _id: { $in: taskIds },
    });
    //preparing respnse
    const response: TaskResponse[] = tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      rewardAmount: task.rewardAmount,
      taskDate: task.taskDate,
      isCompleted: true,
    }));

    return response;
  }
}
