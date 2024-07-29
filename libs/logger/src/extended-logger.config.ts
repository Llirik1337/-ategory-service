import { type LogLevel } from '@nestjs/common';
import { formatters } from './formatters';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Split } from '@app/common';

@Exclude()
export class LoggerConfig {
  @Expose({ name: `LOGGER_LOG_LEVELS` })
  @Split(`|`)
  logLevels: LogLevel[] = [`log`, `error`, `warn`, `debug`, `verbose`];

  @Expose({ name: `LOGGER_FORMATTER` })
  @IsEnum(Object.keys(formatters))
  formatter: keyof typeof formatters = `console`;

  @Expose({ name: `LOGGER_SERVICE_NAME` })
  serviceName = `UNDEFINED_SERVICE`;
}
