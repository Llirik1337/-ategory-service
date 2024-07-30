/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { randomInt } from 'crypto';
import { MessageBusModule } from '@app/message-bus';
import { category, SharedModule } from '@app/shared';
import { createFakeCategory } from './utils';
import { AppModule } from '../src/app.module';
import { Config } from '../src/config';

describe(`Category (e2e)`, () => {
  let app: INestApplication;
  let categoryService: category.CategoryService;
  let testModule: TestingModule;
  let config: Config;

  beforeEach(async () => {
    process.env.PORT = randomInt(40000, 60000).toString();

    testModule = await Test.createTestingModule({
      imports: [
        MessageBusModule.registry(),
        category.CategoryModule,
        SharedModule,
      ],
    }).compile();
    await testModule.init();

    categoryService = testModule.get<category.CategoryService>(
      category.CategoryService,
    );

    app = await AppModule.bootstrap();

    config = app.get<Config>(Config);
  });

  afterEach(async () => {
    await app.close();
    await testModule.close();
  });

  it(`Should create category and get by id and slug`, async () => {
    const category = createFakeCategory();

    await categoryService.create(category);

    const result = await categoryService.findByIdOrSlug(category.slug);
    const resultById = await categoryService.findByIdOrSlug(result.id);

    expect(result).toEqual({
      ...category,
      id: result.id,
      createdDate: result.createdDate,
    });
    expect(resultById).toEqual(result);
  });

  it(`Should throw error if category doesn't exist`, async () => {
    try {
      await categoryService.findByIdOrSlug(`non-existent-slug`);
      expect(true).toBe(false);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect, @typescript-eslint/no-unsafe-member-access
      expect(error.code).toEqual(category.errors.CategoryNotExistError.code);
      // eslint-disable-next-line jest/no-conditional-expect, @typescript-eslint/no-unsafe-member-access
      expect(error.message).toEqual(
        category.errors.CategoryNotExistError.message,
      );
    }
  });

  it(`Should throw error if not exit on update`, async () => {
    try {
      await categoryService.update({ id: `non-existent-id`, name: `test` });
      expect(true).toBe(false);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect, @typescript-eslint/no-unsafe-member-access
      expect(error.code).toEqual(category.errors.CategoryNotExistError.code);
      // eslint-disable-next-line jest/no-conditional-expect, @typescript-eslint/no-unsafe-member-access
      expect(error.message).toEqual(
        category.errors.CategoryNotExistError.message,
      );
    }
  });

  it(`Should throw error if not exit on delete`, async () => {
    try {
      await categoryService.deleteById(`non-existent-id`);
      expect(true).toBe(false);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect, @typescript-eslint/no-unsafe-member-access
      expect(error.code).toEqual(category.errors.CategoryNotExistError.code);
      // eslint-disable-next-line jest/no-conditional-expect, @typescript-eslint/no-unsafe-member-access
      expect(error.message).toEqual(
        category.errors.CategoryNotExistError.message,
      );
    }
  });

  it(`Should throw error if category already exist`, async () => {
    try {
      const category = createFakeCategory();
      await categoryService.create(category);
      await categoryService.create(category);
      expect(true).toBe(false);
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect, @typescript-eslint/no-unsafe-member-access
      expect(error.code).toEqual(
        category.errors.CategoryAlreadyExistsError.code,
      );
      // eslint-disable-next-line jest/no-conditional-expect, @typescript-eslint/no-unsafe-member-access
      expect(error.message).toEqual(
        category.errors.CategoryAlreadyExistsError.message,
      );
    }
  });

  it(`Should return filtered categories by name`, async () => {
    const { createdDate, ...fakeCategory } = createFakeCategory();
    await categoryService.create(fakeCategory);
    const result = (
      await categoryService.find({ name: fakeCategory.name })
    ).map(({ id, createdDate, ...rest }) => rest);

    expect(result).toEqual([fakeCategory]);
  });

  it(`Should return filtered categories by name and description and active`, async () => {
    const count = config.defaultPageSize;
    const expected: any[] = [];
    const description = `test`;
    const name = `test2`;
    const active = true;

    for (let i = 0; i < count; i++) {
      const { createdDate, ...fakeCategory } = createFakeCategory({
        name,
        description,
        active,
      });

      await categoryService.create(fakeCategory);
      expected.push(fakeCategory);
    }

    const result = await categoryService.find({
      name,
      description,
      active,
    });

    expect(result.length).toEqual(count);
  });

  it(`Should return filtered categories by search and active and ignore name and description`, async () => {
    const count = config.defaultPageSize;
    const expected: any[] = [];
    const description = `222test`;
    const name = `222test2`;
    const active = true;

    for (let i = 0; i < count; i++) {
      const { createdDate, ...fakeCategory } = createFakeCategory({
        name,
        description,
        active,
      });

      await categoryService.create(fakeCategory);
      expected.push(fakeCategory);
    }

    const result = await categoryService.find({
      name,
      description,
      search: `test`,
      active,
    });

    expect(result.length).toEqual(count);
  });
});
