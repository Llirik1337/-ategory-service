import { Test, type TestingModule } from '@nestjs/testing';
import { type Db } from 'mongodb';
import { getMongoDatabaseToken } from 'nestjs-mongodb-native';
import { AppModule } from '../app.module';
import { createFakeUser } from '../../test/utils';
import { UserRepository } from '../repositories';
import { UserAlreadyExistError } from '@app/shared';

describe(UserRepository.name, () => {
  let repository: UserRepository;
  let db: Db;

  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    repository = moduleRef.get(UserRepository);
    db = moduleRef.get(getMongoDatabaseToken());
  });

  beforeEach(async () => {
    await repository.onModuleInit();
    console.log(await db.indexInformation(`users`));
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it(`should save user`, async () => {
    const user = createFakeUser();
    const result = await repository.save(user);
    expect(result).toStrictEqual({
      ...user,
      _id: expect.any(String) as string,
    });
  });

  it(`should throw error if user already exists`, async () => {
    const user = createFakeUser();
    await repository.save(user);
    await expect(repository.save(user)).rejects.toThrow(UserAlreadyExistError);
  });

  it(`should find user by email`, async () => {
    const user = createFakeUser();
    await repository.save(user);
    expect(await repository.findOne({ email: user.email })).toStrictEqual({
      ...user,
      _id: expect.any(String) as string,
    });
  });

  it(`should delete user by id`, async () => {
    const user = await repository.save(createFakeUser());
    await repository.deleteById(user);
    expect(await repository.findOne({ email: user.email })).toBeNull();
  });
});
