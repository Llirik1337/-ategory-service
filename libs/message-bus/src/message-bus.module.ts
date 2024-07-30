import { type DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypedConfigModule } from '@app/common';

import { MessageBusConfig } from './message-bus.config';
import { MessageBusService } from './message-bus.service';

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
