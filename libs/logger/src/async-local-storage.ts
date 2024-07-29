import { type LoggerService } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { type ExtendedLoggerService } from './extended-logger.service';

export type ContextType = 'HTTP' | 'WS' | 'NATS';

export interface Storage<L extends LoggerService = ExtendedLoggerService> {
  requestId?: string;
  traceId?: string;
  context?: ContextType;
  logger: L;
}

export const asyncLocalStorage = new AsyncLocalStorage<Storage>();
