import { type DynamicModule, Module } from '@nestjs/common';
import { ExtendedLoggerService } from './extended-logger.service';
import { TypedConfigModule } from '@app/common';
import { LoggerConfig as ExtendedLoggerConfig } from './extended-logger.config';

@Module({
  imports: [TypedConfigModule.registry(ExtendedLoggerConfig)],
  providers: [ExtendedLoggerService],
  exports: [ExtendedLoggerService],
})
export class ExtendedLoggerModule {
  static registry(config?: Partial<ExtendedLoggerConfig>): DynamicModule {
    return {
      module: ExtendedLoggerModule,
      imports: [TypedConfigModule.registry(ExtendedLoggerConfig, config)],
      providers: [ExtendedLoggerService],
      exports: [ExtendedLoggerService],
    };
  }
}
