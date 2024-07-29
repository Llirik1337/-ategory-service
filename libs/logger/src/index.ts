import { ExtendedLoggerService } from './extended-logger.service';

export * from './extended-logger.module';
export * from './extended-logger.service';
export * from './extended-logger.config';
export * from './logging.interceptor';

export const L = (): ExtendedLoggerService => ExtendedLoggerService.getLogger();
