import { IsString } from "class-validator";

export class CompleteTaskDto {
  @IsString()
  userId: string;
  @IsString()
  taskId: string;
}
