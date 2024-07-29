import { Test, type TestingModule } from '@nestjs/testing';
import Redlock from 'redlock';
import { RedlockModule } from './redlock.module';

describe(RedlockModule.name, () => {
  let redlock: Redlock;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [RedlockModule.registry()],
    }).compile();

    redlock = moduleRef.get(Redlock);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it(`Should get lock`, async () => {
    let result: boolean;
    try {
      const lock = await redlock.acquire([`a`], 5000);
      await lock.release();
      result = true;
    } catch (error) {
      result = false;
    }

    expect(result).toBeTruthy();
  });
});
