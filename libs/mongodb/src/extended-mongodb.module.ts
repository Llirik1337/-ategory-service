import { TypedConfigModule } from '@app/common';
import { type DynamicModule, Module } from '@nestjs/common';

import {
  MongodbModule as ExternalMongodbModule,
  type MongodbModuleOptions,
} from 'nestjs-mongodb-native';
import { ExtendedMongodbConfig } from './extended-mongodb.config';

@Module({})
export class ExtendedMongodbModule {
  static register(config?: Partial<ExtendedMongodbConfig>): DynamicModule {
    return {
      module: ExtendedMongodbModule,
      imports: [
        ExternalMongodbModule.forRootAsync({
          imports: [TypedConfigModule.registry(ExtendedMongodbConfig, config)],
          inject: [ExtendedMongodbConfig],
          useFactory: (config: ExtendedMongodbConfig): MongodbModuleOptions => {
            return {
              url: config.url,
              dbName: config.dataBase,
            };
          },
        }),
      ],
    };
  }
}
