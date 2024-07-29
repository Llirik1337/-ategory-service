import { Injectable, type LogLevel, type LoggerService } from '@nestjs/common';
import { LoggerConfig } from './extended-logger.config';
import { asyncLocalStorage, type Storage } from './async-local-storage';
import { type Formatter, formatters } from './formatters';

export function isCheckNestMessage(message: string): boolean {
  const isDependenciesInitialized = message.endsWith(
    `dependencies initialized`,
  );

  const isNestMicroserviceStarted =
    message === `Nest microservice successfully started`;

  const isNestAppicationStarted =
    message === `Nest application successfully started`;

  const isStatingNestApplication = message === `Starting Nest application...`;

  const isMappedRoute = /^Mapped {.*, .*} route$/.test(message);

  const isController = /^.*Controller {.*}:$/.test(message);

  return (
    isStatingNestApplication ||
    isDependenciesInitialized ||
    isNestMicroserviceStarted ||
    isNestAppicationStarted ||
    isMappedRoute ||
    isController
  );
}

@Injectable()
export class ExtendedLoggerService implements LoggerService {
  private static defaultConfig: LoggerConfig;
  private readonly formatter: Formatter;

  constructor(private readonly config: LoggerConfig) {
    ExtendedLoggerService.defaultConfig = config;
    this.formatter = formatters[config.formatter];
  }

  getStorage(): Storage | undefined {
    return asyncLocalStorage.getStore();
  }

  static getLogger(storage?: Omit<Storage, 'logger'>): ExtendedLoggerService {
    const existedLogger = asyncLocalStorage.getStore()?.logger;

    if (existedLogger != null) {
      return existedLogger;
    }

    const logger = new ExtendedLoggerService(
      ExtendedLoggerService.defaultConfig,
    );

    const { traceId, requestId, context } = storage ?? {};

    asyncLocalStorage.enterWith({
      logger,
      requestId,
      context,
      traceId,
    });

    return logger;
  }

  private getData(data: unknown): unknown {
    if (Array.isArray(data) && data.length === 0) {
      return undefined;
    }

    if (data instanceof Array && data.length === 1) {
      return data[0];
    }

    return data;
  }

  log(message: string, ...data: unknown[]): void {
    const logLevel = `log`;

    if (this.config.logLevels.includes(logLevel)) {
      const { traceId, requestId, context } =
        asyncLocalStorage.getStore() ?? {};

      this.formatter.write({
        timestamp: new Date(),
        traceId,
        logLevel,
        message,
        data: isCheckNestMessage(message) ? undefined : this.getData(data),
        service: this.config.serviceName,
        requestId,
        context,
      });
    }
  }

  error(message: string, ...data: unknown[]): void {
    const logLevel = `error`;

    if (this.config.logLevels.includes(logLevel)) {
      const { traceId, requestId, context } =
        asyncLocalStorage.getStore() ?? {};

      this.formatter.write({
        timestamp: new Date(),
        message,
        traceId,
        data: isCheckNestMessage(message) ? undefined : this.getData(data),
        logLevel,
        requestId,
        context,
        service: this.config.serviceName,
      });
    }
  }

  warn(message: string, ...data: unknown[]): void {
    const logLevel = `warn`;

    if (this.config.logLevels.includes(logLevel)) {
      const { traceId, requestId, context } =
        asyncLocalStorage.getStore() ?? {};

      this.formatter.write({
        timestamp: new Date(),
        message,
        traceId,
        data: isCheckNestMessage(message) ? undefined : this.getData(data),
        logLevel,
        requestId,
        context,
        service: this.config.serviceName,
      });
    }
  }

  debug(message: string, ...data: unknown[]): void {
    const logLevel = `debug`;

    if (this.config.logLevels.includes(logLevel)) {
      const { traceId, requestId, context } =
        asyncLocalStorage.getStore() ?? {};

      this.formatter.write({
        timestamp: new Date(),
        message,
        traceId,
        data: isCheckNestMessage(message) ? undefined : this.getData(data),
        logLevel,
        requestId,
        context,
        service: this.config.serviceName,
      });
    }
  }

  verbose(message: string, ...data: unknown[]): void {
    const logLevel = `verbose`;

    if (this.config.logLevels.includes(logLevel)) {
      const { traceId, requestId, context } =
        asyncLocalStorage.getStore() ?? {};

      this.formatter.write({
        timestamp: new Date(),
        message,
        traceId,
        data: isCheckNestMessage(message) ? undefined : this.getData(data),
        logLevel,
        requestId,
        context,
        service: this.config.serviceName,
      });
    }
  }

  setLogLevels(levels: LogLevel[]): void {
    this.config.logLevels = levels;
  }
}
