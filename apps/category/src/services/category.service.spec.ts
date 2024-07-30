import { Test, type TestingModule } from '@nestjs/testing';
import { type Db } from 'mongodb';
import { getMongoDatabaseToken } from 'nestjs-mongodb-native';
import { AppModule } from '../app.module';
import { CategoryService } from './category.service';
import { createFakeCategory } from '../../test/utils';
import { category } from '@app/shared';
import { Config } from '../config';
import { faker } from '@faker-js/faker';

describe(CategoryService.name, () => {
  let service: CategoryService;
  let config: Config;
  let db: Db;

  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    config = moduleRef.get<Config>(Config);
    service = moduleRef.get(CategoryService);
    db = moduleRef.get(getMongoDatabaseToken());
  });

  beforeEach(async () => {
    await moduleRef.init();
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it(`Should save and find by slug and id`, async () => {
    const category = createFakeCategory();
    const saved = await service.save(category);
    const result = await service.findByIdOrSlug(saved._id);
    const resultBySlug = await service.findByIdOrSlug(saved.slug);
    expect(result).toEqual(saved);
    expect(resultBySlug).toEqual(saved);
  });

  it(`Should find by name, description and active`, async () => {
    const category = createFakeCategory();
    const saved = await service.save(category);
    const result = await service.find({
      name: category.name,
      description: category.description,
      active: category.active,
    });
    expect(result).toEqual([saved]);
  });

  it(`Should sort by name and direction ASC`, async () => {
    const savedOne = await service.save(createFakeCategory({ name: `a` }));
    const savedTwo = await service.save(createFakeCategory({ name: `b` }));
    const result = await service.find({
      sortBy: `name`,
      sortDirection: category.enum.Direction.ASC,
    });
    expect(result).toEqual([savedOne, savedTwo]);
  });

  it(`Should sort by name and direction DESC`, async () => {
    const savedOne = await service.save(createFakeCategory({ name: `a` }));
    const savedTwo = await service.save(createFakeCategory({ name: `b` }));
    const result = await service.find({
      sortBy: `name`,
      sortDirection: category.enum.Direction.DESC,
    });
    expect(result).toEqual([savedTwo, savedOne]);
  });

  it(`Should return empty array if can't find any`, async () => {
    const result = await service.find({
      name: `a`,
      description: `b`,
      active: true,
    });
    expect(result).toEqual([]);
  });

  it(`Should return default count elements`, async () => {
    for (let i = 0; i < 10; i++) {
      await service.save(createFakeCategory());
    }

    const result = await service.find({});
    expect(result.length).toEqual(config.defaultPageSize);
  });

  it(`Should get all element by pagination`, async () => {
    const pages = 10;
    const saved: category.entities.CategoryEntity[] = [];
    for (let i = 0; i < config.defaultPageSize * pages; i++) {
      saved.push(await service.save(createFakeCategory()));
    }

    saved.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());

    const result: category.entities.CategoryEntity[] = [];

    for (let i = 0; i < pages; i++) {
      result.push(
        ...(await service.find({ page: i, pageSize: config.defaultPageSize })),
      );
    }

    expect(result).toEqual(saved);
  });

  it(`Should ignore name and description if search is not empty`, async () => {
    const category = createFakeCategory({
      description: `${faker.lorem.text()} TEST`,
    });
    const saved = await service.save(category);
    const result = await service.find({
      search: saved.name,
      name: `a`,
      description: `b`,
    });

    expect(result).toEqual([saved]);
  });
});
