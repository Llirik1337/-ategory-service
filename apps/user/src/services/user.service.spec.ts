import { Test, type TestingModule } from '@nestjs/testing';
import { type Db } from 'mongodb';
import { connect, type NatsConnection } from 'nats';
import { getMongoDatabaseToken } from 'nestjs-mongodb-native';
import { AppModule } from '../app.module';
import { createFakeUser } from '../../test/utils';
import { UserService } from './user.service';
import { MessageBusConfig } from '@app/message-bus';
import { UserNotExistError } from '@app/shared';

describe(UserService.name, () => {
  let service: UserService;
  let db: Db;

  let nc: NatsConnection;

  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get(UserService);
    db = moduleRef.get(getMongoDatabaseToken());

    const natsConfig: MessageBusConfig = moduleRef.get(MessageBusConfig);

    nc = await connect({
      servers: natsConfig.url,
    });
  });

  beforeEach(async () => {
    await moduleRef.init();
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await moduleRef.close();
    await nc.flush();
    await nc.drain();
  });

  it(`should register user`, async () => {
    const user1 = createFakeUser();

    const result = await service.register(user1);

    expect(result).toStrictEqual({
      ...user1,
      _id: expect.any(String) as string,
      password: expect.any(String) as string,
    });
  });

  it(`should throw error if user not found`, async () => {
    await expect(service.auth(createFakeUser())).rejects.toThrow(
      UserNotExistError,
    );
  });

  it(`should throw error if password is invalid`, async () => {
    const user = createFakeUser();
    await service.register(user);
    await expect(
      service.auth({ ...user, password: `<PASSWORD>` }),
    ).rejects.toThrow(`Invalid password`);
  });

  it(`should return true if user is authenticated`, async () => {
    const user = createFakeUser();
    await service.register(user);

    const result = await service.auth({
      email: user.email,
      password: user.password,
    });

    expect(result).toStrictEqual({
      accessToken: expect.any(String) as string,
      refreshToken: expect.any(String) as string,
    });
  });
});
