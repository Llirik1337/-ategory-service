import { Test, type TestingModule } from '@nestjs/testing';
import { type Db } from 'mongodb';
import { getMongoDatabaseToken } from 'nestjs-mongodb-native';
import { AppModule } from '../app.module';
import { CategoryRepository } from './category.repository';
import { createFakeCategory } from '../../test/utils';
import { category as sharedCategory } from '@app/shared';

describe(CategoryRepository.name, () => {
  let repository: CategoryRepository;
  let db: Db;

  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    repository = moduleRef.get(CategoryRepository);
    db = moduleRef.get(getMongoDatabaseToken());
  });

  beforeEach(async () => {
    await repository.onModuleInit();
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it(`Should save`, async () => {
    const category = createFakeCategory();
    const result = await repository.save(category);
    expect(result).toStrictEqual({
      ...category,
      _id: expect.any(String) as string,
    });
  });

  it(`Should throw error if already exists`, async () => {
    const category = createFakeCategory();
    await repository.save(category);
    await expect(repository.save(category)).rejects.toThrow(
      sharedCategory.errors.CategoryAlreadyExistsError,
    );
  });

  it(`Should delete by id`, async () => {
    const category = await repository.save(createFakeCategory());
    await repository.deleteById(category._id);
    expect(await repository.findByIdOrSlug(category.slug)).toBeNull();
  });

  it(`Should update`, async () => {
    const category = await repository.save(createFakeCategory());
    const newCategory = createFakeCategory();
    await repository.update(category._id, newCategory);
    expect(await repository.findByIdOrSlug(newCategory.slug)).toStrictEqual({
      ...newCategory,
      _id: category._id,
    });
  });

  it(`Should find by search`, async () => {
    const category = await repository.save(createFakeCategory());
    const result = await repository.findWithSearch({
      search: category.name,
    });
    expect(result).toStrictEqual([category]);
  });
});
