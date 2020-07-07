import { BadRequestException, PipeTransform } from '@nestjs/common';
import {TaskStatus} from '../tasks.model';

export class TaskStatusValidationPipes implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any): any {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)){
      throw new BadRequestException(`"${value}" is an invalid status`)
    }
    return value;
  }

  private isStatusValid(status: any): boolean {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}