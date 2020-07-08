import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/filter-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  // private tasks: Task[] = [];
  //
  // getAllTasks(): Task[] {
  //   return this.tasks
  // }
  //
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const {status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status){
  //     tasks = tasks.filter(task => task.status === status)
  //   }
  //   if (search){
  //     tasks = tasks.filter(task =>
  //       task.title.includes(search) ||
  //       task.description.includes(search),
  //     )
  //   }
  //   return tasks
  // }
  //
  //
  async getTaskById(id: number): Promise<Task>{
    const task = await this.taskRepository.findOne(id);

    if (!task){
      throw new NotFoundException(`Task with id "${id} not found"`);
    }
    return task

  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto)
  }

  // updateTaskById(id: string, status: string): Task{
  //   const task = this.getTaskById(id);
  //   task.status = TaskStatus[status];
  //   return task
  // }
  //
  // deleteTaskById(id: string): void {
  //   const task = this.getTaskById(id);
  //   this.tasks = this.tasks.filter(item => item.id !== task.id)
  // }


}
