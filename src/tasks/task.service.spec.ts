import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/filter-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { NotFoundException } from '@nestjs/common';
import mock = jest.mock;
import { Task } from './task.entity';
import exp from 'constants';

const mockUser = {
  id: 12,
  username: 'Test user',
};

const mockTask = {
  id: 1,
  title: "Task 1",
  status: TaskStatus.IN_PROGRESS,
  description: "test description"
};

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
});

describe('TaskService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {provide: TaskRepository, useFactory: mockTaskRepository},
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'here',
      };
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById',() => {
    it('calls taskRepository.findOne() and successfully retrieves and return', async() => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
      where: {id: 1, userId: mockUser.id}
    })
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);

    });
  });

  describe('createTask', () => {
    it('calls taskRepository.createTask() and returns task', async () => {
      taskRepository.createTask.mockResolvedValue(mockTask);

      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const result = await tasksService.createTask(mockTask, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask,  mockUser);
      expect(result).toEqual(mockTask);
    });

  });

    describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() and deletes task ', async () => {
      taskRepository.delete.mockResolvedValue({affected:1});
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTaskById(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({id:1, userId: mockUser.id});

    });

    it('throws error as task could not be found', async () => {
      taskRepository.delete.mockResolvedValue({affected:0});
      expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });

  });

  describe('updateTask', () => {
    it('calls taskRepository.updatetask() and updates and returns task', async () => {
      const save = jest.fn().mockResolvedValue(true)
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status:TaskStatus.DONE,
        save,
      });

      taskRepository.findOne.mockResolvedValue(mockTask);
      expect(tasksService.getTaskById).not.toHaveBeenCalled();

      // expect(mockTask.status).toEqual(TaskStatus.IN_PROGRESS);
      const result = await tasksService.updateTaskById(1, TaskStatus.DONE, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE)
    });

    it('throws an exception if task with id is not found', async () => {
      expect(tasksService.updateTaskById(1, TaskStatus.DONE, mockUser)).rejects.toThrow();
    });

  });

});