import { TypedConfigModule } from '@app/common';
import { CryptoModule } from '@app/crypto';
import { JwtModule } from '@app/jwt';
import { ExtendedLoggerModule, ExtendedLoggerService } from '@app/logger';
import { MessageBusConfig, MessageBusModule } from '@app/message-bus';
import { ExtendedMongodbModule } from '@app/mongodb';
import { RedisModule } from '@app/redis';
import { SharedModule, sharedUser } from '@app/shared';
import { Module, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongodbModule } from 'nestjs-mongodb-native';
import { Config } from './config';
import * as controllers from './controllers';

@Module({
  imports: [
    SharedModule,
    ExtendedLoggerModule.registry({ serviceName: `GATEWAY` }),
    MessageBusModule.registry({ queue: `GATEWAY` }),
    JwtModule.registry(),
    CryptoModule.registry(),
    RedisModule.registry(),
    TypedConfigModule.registry(Config),
    sharedUser.UserModule,
    ExtendedMongodbModule.register({
      dataBase: `gateway`,
    }),
    MongodbModule.forFeature({
      collectionName: `users`,
    }),
  ],
  controllers: Object.values(controllers),
})
export class AppModule {
  static async bootstrap(): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    const natsConfig = app.get(MessageBusConfig);
    const appConfig = app.get(Config);

    const logger = app.get(ExtendedLoggerService);

    app.useLogger(logger);

    app.connectMicroservice<MicroserviceOptions>(
      {
        transport: Transport.NATS,
        options: {
          servers: [natsConfig.url],
        },
      },
      { inheritAppConfig: true },
    );

    const config = new DocumentBuilder()
      .setTitle(`Ice box`)
      .setDescription(`The ice box API description`)
      .setVersion(`1.0`)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`api`, app, document);

    await app.startAllMicroservices();
    await app.listen(appConfig.port);

    return app;
  }
}
