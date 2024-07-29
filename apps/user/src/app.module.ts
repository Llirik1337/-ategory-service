import { TypedConfigModule } from '@app/common';
import { CryptoModule } from '@app/crypto';
import { JwtModule } from '@app/jwt';
import { ExtendedLoggerModule, ExtendedLoggerService } from '@app/logger';
import { MessageBusConfig, MessageBusModule } from '@app/message-bus';
import { ExtendedMongodbModule } from '@app/mongodb';
import { SharedModule } from '@app/shared';
import { Module, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import { MongodbModule } from 'nestjs-mongodb-native';
import { AppController } from './app.controller';
import { Config } from './config';
import * as repositories from './repositories';
import * as services from './services';
import { RedisModule } from '@app/redis';
import { RedlockModule } from '@app/redlock';

@Module({
  imports: [
    SharedModule,
    TypedConfigModule.registry(Config),
    ExtendedLoggerModule.registry({ serviceName: `USER` }),
    MessageBusModule.registry({
      queue: `USER`,
    }),
    CryptoModule.registry(),
    JwtModule.registry(),
    ExtendedMongodbModule.register({
      dataBase: `user`,
    }),
    MongodbModule.forFeature({
      collectionName: `users`,
    }),
    MongodbModule.forFeature({
      collectionName: `refresh-tokens`,
    }),
    RedisModule.registry(),
    RedlockModule.registry(),
  ],
  controllers: [AppController],
  providers: [...Object.values(services), ...Object.values(repositories)],
})
export class AppModule {
  static async bootstrap(): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    const logger = app.get(ExtendedLoggerService);

    app.useLogger(logger);

    const natsConfig = app.get(MessageBusConfig);

    app.connectMicroservice<MicroserviceOptions>(
      {
        transport: Transport.NATS,
        options: {
          servers: [natsConfig.url],
        },
      },
      { inheritAppConfig: true },
    );

    await app.startAllMicroservices();

    return app;
  }
}
