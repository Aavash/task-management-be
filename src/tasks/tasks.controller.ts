import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/filter-task.dto';
import { TaskStatusValidationPipes } from './pipes/task-status-validation.pipes';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  //
  // @Get()
  // getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
  //   if(Object.keys(filterDto).length){
  //     return this.tasksService.getTasksWithFilters(filterDto)
  //   } else {
  //     return this.tasksService.getAllTasks()
  //   }
  //
  // }
  //
  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task>{
    return this.tasksService.getTaskById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task>{
    return this.tasksService.createTask(createTaskDto)
  }

  // @Patch('/:id/status')
  // updateTaskById(
  //   @Param('id') id: string,
  //   @Body('status', TaskStatusValidationPipes) status: TaskStatus): Task{
  //   return this.tasksService.updateTaskById(id, status)
  // }
  //
  // @Delete('/:id')
  // deleteTaskById(@Param('id') id: string): void{
  //   return this.tasksService.deleteTaskById(id)
  // }
}
