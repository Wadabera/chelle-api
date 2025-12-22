import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TaskService } from '../services/tasks.service';
import { CompleteTaskDto } from '../dtos/tasks.dto';
import { jwtAuthGuard } from 'src/commons/guards/jwtauth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskservice: TaskService) {}
  @Get('gate-daily-task')
  async getDailyTasks() {
    const result = await this.taskservice.getDailyTasks();
    return result;
  }
  //!complete and update task
  @jwtAuthGuard()
  @Patch('task-complete/:taskId')
  async completeTask(@Param('taskId') taskId: string, @Req() req: any) {
    const currentUser = req.user;
    const result = await this.taskservice.completeTask(currentUser, taskId);
    return result;
  }
  //!get all completed task
  @jwtAuthGuard()
  @Get('get-my-complete-task')
  async getMyCompleteTasks(@Req() req: any) {
    const currentUser = req.user;
    return await this.taskservice.getUserCompletedTasks(currentUser);
  }
}
