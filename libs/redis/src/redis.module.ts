import { TypedConfigModule } from '@app/common';
import {
  type DynamicModule,
  Module,
  type OnModuleDestroy,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisConfig } from './redis.config';

@Module({
  providers: [],
  exports: [],
})
export class RedisModule implements OnModuleDestroy {
  constructor(private readonly redis: Redis) {}

  onModuleDestroy(): void {
    this.redis.disconnect(false);
  }

  static registry(config?: Partial<RedisConfig>): DynamicModule {
    return {
      module: RedisModule,
      imports: [TypedConfigModule.registry(RedisConfig, config)],
      providers: [
        {
          provide: Redis,
          inject: [RedisConfig],
          async useFactory(config: RedisConfig) {
            const client = new Redis(config.url, { lazyConnect: true });
            await client.connect();
            return client;
          },
        },
      ],
      exports: [Redis],
    };
  }
}
