import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/filter-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
    return this.taskRepository.getTasks(filterDto)
  }

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

  async updateTaskById(id: number, status: TaskStatus): Promise<Task>{
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id=id);

    if (result.affected === 0){
      throw new NotFoundException(`Task with id "${id} does not exist"`);
    }
  }

}
