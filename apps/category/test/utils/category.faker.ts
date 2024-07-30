import { type category } from '@app/shared';
import { faker } from '@faker-js/faker';

export const createFakeCategory = (
  data?: Partial<category.entities.CategoryEntity>,
): category.entities.CategoryEntity => ({
  name: faker.word.noun(),
  slug: faker.word.noun(),
  description: faker.lorem.text(),
  active: true,
  createdDate: new Date(),
  ...data,
});
