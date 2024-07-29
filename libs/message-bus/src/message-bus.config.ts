import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class MessageBusConfig {
  @Expose({
    name: `NATS_URL`,
  })
  @IsString()
  url = `nats://127.0.0.1:4222`;

  @Expose({ name: `NATS_QUEUE` })
  @IsString()
  queue = `UNDEFINED`;
}
