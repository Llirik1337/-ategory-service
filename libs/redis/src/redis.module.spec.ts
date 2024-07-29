import { Test, type TestingModule } from '@nestjs/testing';
import { RedisModule } from './redis.module';
import Redis from 'ioredis';

describe(RedisModule.name, () => {
  let redis: Redis;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [RedisModule.registry()],
    }).compile();

    redis = moduleRef.get(Redis);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it(`Should set key`, async () => {
    const key = `TEST`;
    const value = `123`;
    await redis.set(key, value);
    const data = await redis.get(key);
    expect(data).toStrictEqual(value);
  });
});
