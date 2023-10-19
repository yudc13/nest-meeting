import { SetMetadata } from '@nestjs/common';

export const LOG_KEY = 'log_record';

export enum LOG_ACTION {
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  ADD = 'ADD',
}

export const Log = (
  action: string,
  template: string,
  mapping?: Record<string, string>,
) => SetMetadata(LOG_KEY, [action, template, mapping]);
