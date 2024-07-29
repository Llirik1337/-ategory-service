import { type DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageBusConfig } from './message-bus.config';
import { MessageBusService } from './message-bus.service';
import { TypedConfigModule } from '@app/common';

@Module({})
export class MessageBusModule {
  static registry(config?: Partial<MessageBusConfig>): DynamicModule {
    return {
      module: MessageBusModule,
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [
            {
              name: `CLIENT_PROXY`,
              imports: [TypedConfigModule.registry(MessageBusConfig, config)],
              inject: [MessageBusConfig],
              useFactory: (config: MessageBusConfig) => ({
                transport: Transport.NATS,
                options: {
                  servers: [config.url],
                  headers: {
                    sender: config.queue,
                  },
                },
              }),
            },
          ],
        }),
      ],
      providers: [MessageBusService],
      exports: [MessageBusService],
    };
  }
}
