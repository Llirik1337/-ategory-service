import { Injectable, type LogLevel } from '@nestjs/common';
import { type Formatter, type FormatterWriteParams } from './index';

export interface GoogleMessage {
  level: Uppercase<LogLevel>;
  timestamp: string;
  requestId?: string;
  traceId?: string;
  message: string;
  data: unknown;
  service: string;
  context?: string;
}

@Injectable()
export class GoogleFormatter implements Formatter {
  public write(params: FormatterWriteParams): void {
    const logMessage: GoogleMessage = {
      timestamp: params.timestamp.toISOString(),
      data: params.data,
      level: params.logLevel.toLocaleUpperCase() as Uppercase<LogLevel>,
      message: params.message,
      requestId: params.requestId,
      traceId: params.traceId,
      service: params.service,
      context: params.context,
    };

    switch (params.logLevel) {
      case `debug`: {
        console.log(logMessage);
        break;
      }

      case `log`:
      case `verbose`: {
        console.log(logMessage);
        break;
      }

      case `error`: {
        console.log(logMessage);
        break;
      }

      case `warn`: {
        console.log(logMessage);
        break;
      }
    }
  }
}
