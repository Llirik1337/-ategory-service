import { type sharedUser } from '@app/shared';
import { faker } from '@faker-js/faker';

export const createFakeUser = (
  data?: Partial<sharedUser.UserEntity>,
): sharedUser.UserEntity => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...data,
});

export const createFakeUsers = (count: number): sharedUser.UserEntity[] =>
  Array.from(
    {
      length: count,
    },
    () => createFakeUser(),
  );
