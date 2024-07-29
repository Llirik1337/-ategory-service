import { ConsoleFormatter } from './console.formatter';
import { GoogleFormatter } from './google.formatter';

import { type LogLevel } from '@nestjs/common';
import { type ContextType } from '../async-local-storage';

export interface FormatterWriteParams {
  logLevel: LogLevel;
  requestId?: string;
  traceId?: string;
  message: string;
  data: unknown;
  service: string;
  context?: ContextType;
  timestamp: Date;
}

export interface Formatter {
  write: (params: FormatterWriteParams) => void;
}

export const formatters = {
  google: new GoogleFormatter(),
  console: new ConsoleFormatter(),
} satisfies Record<string, Formatter>;
