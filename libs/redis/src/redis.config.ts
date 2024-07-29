import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class RedisConfig {
  @IsString()
  @Expose({ name: `REDIS_URL` })
  url = `127.0.0.1:6379`;
}
