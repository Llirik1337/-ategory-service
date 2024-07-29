import { Injectable } from '@nestjs/common';
import colors from 'colors';
import { type Formatter, type FormatterWriteParams } from './index';

@Injectable()
export class ConsoleFormatter implements Formatter {
  public write(params: FormatterWriteParams): void {
    const dateTime = `[${params.timestamp.toISOString()}]`;

    const logLevel = `[${params.logLevel.toLocaleUpperCase()}]`;

    const requestId =
      params.requestId !== undefined ? `[${params.requestId}]` : ``;
    const traceId = params.traceId !== undefined ? `[${params.traceId}]` : ``;

    const context = params.context !== undefined ? `[${params.context}]` : ``;
    const serviceName = `[${params.service}]`;

    const data =
      params.data !== undefined
        ? `\n` + JSON.stringify(params.data, undefined, 1)
        : ``;

    const prefix =
      dateTime + serviceName + context + requestId + traceId + logLevel + `:`;

    const formatMessage = (
      prefix: string,
      message: string,
      data: string,
    ): string => {
      return `${prefix} ${message}${data}`;
    };

    switch (params.logLevel) {
      case `debug`:
      case `verbose`: {
        const message = formatMessage(
          colors.green(prefix),
          params.message,
          data,
        );

        console.log(message);
        break;
      }
      case `log`: {
        const message = formatMessage(
          colors.dim(prefix),
          colors.dim(params.message),
          colors.dim(data),
        );

        console.log(message);
        break;
      }
      case `error`: {
        const message = formatMessage(colors.red(prefix), params.message, data);

        console.log(message);
        break;
      }
      case `warn`: {
        const message = formatMessage(
          colors.yellow(prefix),
          params.message,
          data,
        );

        console.log(message);
        break;
      }
    }
  }
}
