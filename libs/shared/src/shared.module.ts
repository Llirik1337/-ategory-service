import {
  Module,
  type OnApplicationBootstrap,
  ValidationPipe,
} from '@nestjs/common';

import { L, LoggingInterceptor } from '@app/logger';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ExtendedExceptionFilter } from './extended-exception.filter';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExtendedExceptionFilter,
    },
  ],
})
export class SharedModule implements OnApplicationBootstrap {
  onApplicationBootstrap(): void {
    process.on(`uncaughtException`, (error, origin) => {
      L().error(`uncaughtException`, { error, origin });
      process.exit(1);
    });

    process.on(`unhandledRejection`, (reason, promise) => {
      L().error(`unhandledRejection`, { reason, promise });
    });
  }
}
