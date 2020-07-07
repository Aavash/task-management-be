import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const {status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status){
      tasks = tasks.filter(task => task.status === status)
    }
    if (search){
      tasks = tasks.filter(task =>
        task.title.includes(search) ||
        task.description.includes(search),
      )
    }
    return tasks
  }


  getTaskById(id: string): Task{
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with Id "${id}" was not found`);
    }

    return task
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const {title, description} = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTaskById(id: string, status: string): Task{
    const task = this.getTaskById(id);
    task.status = TaskStatus[status];
    return task
  }

  deleteTaskById(id: string): void {
    const task = this.getTaskById(id);
    this.tasks = this.tasks.filter(item => item.id !== task.id)
  }


}
