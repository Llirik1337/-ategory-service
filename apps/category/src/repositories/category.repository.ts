import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectCollection } from 'nestjs-mongodb-native';
import { Collection, addId, type StringId } from '@app/mongodb';
import { category as sharedCategory } from '@app/shared';
import { type Filter, MongoServerError } from 'mongodb';

@Injectable()
export class CategoryRepository implements OnModuleInit {
  constructor(
    @InjectCollection(`categories`)
    private readonly collection: Collection<
      sharedCategory.entities.CategoryEntity & StringId
    >,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.collection.createIndex({ slug: 1 }, { unique: true });
    await this.collection.createIndex({ name: 1 });
    await this.collection.createIndex({ description: 1 });
    await this.collection.createIndex({ active: 1 });
    await this.collection.createIndex({ createdDate: -1 });
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.collection.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new sharedCategory.errors.CategoryNotExistError();
    }
  }

  async update(
    id: string,
    category: Partial<
      Omit<sharedCategory.entities.CategoryEntity, 'createdDate'>
    >,
  ): Promise<sharedCategory.entities.CategoryEntity & StringId> {
    try {
      const result = await this.collection.findOneAndUpdate(
        { _id: id },
        { $set: category },
      );

      if (result.value == null) {
        throw new sharedCategory.errors.CategoryNotExistError();
      }

      return result.value;
    } catch (error) {
      if (error instanceof MongoServerError) {
        if (error.code === 11000) {
          throw new sharedCategory.errors.CategoryAlreadyExistsError();
        }
      }
      throw error;
    }
  }

  async findByIdOrSlug(
    idOrSlug: string,
  ): Promise<(sharedCategory.entities.CategoryEntity & StringId) | null> {
    return this.collection.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
    });
  }

  async find(
    params: Partial<sharedCategory.entities.CategoryEntity & { id: string }>,
    options?: {
      limit?: number;
      skip?: number;
      sort?: Record<
        keyof sharedCategory.entities.CategoryEntity,
        sharedCategory.enum.Direction
      >;
    },
  ): Promise<Array<sharedCategory.entities.CategoryEntity & StringId>> {
    const filter: Filter<sharedCategory.entities.CategoryEntity & StringId> =
      {};

    if (params.active !== undefined) {
      filter.active = params.active;
    }

    if (params.id !== undefined) {
      filter._id = params.id;
    }

    if (params.slug !== undefined) {
      filter.slug = params.slug;
    }

    if (params.name !== undefined) {
      filter.name = {
        $in: [params.name.replaceAll(`е`, `ё`), params.name],
      };
    }

    if (params.description !== undefined) {
      filter.description = {
        $in: [params.description.replaceAll(`е`, `ё`), params.description],
      };
    }

    return this.collection.find(filter, { ...options }).toArray();
  }

  async findWithSearch(
    params: {
      search: string;
    } & Partial<Pick<sharedCategory.entities.CategoryEntity, 'active'>>,
    options?: {
      limit?: number;
      skip?: number;
      sort?: Record<
        keyof sharedCategory.entities.CategoryEntity,
        sharedCategory.enum.Direction
      >;
    },
  ): Promise<Array<sharedCategory.entities.CategoryEntity & StringId>> {
    const { search, active } = params;

    const search2 = search.replaceAll(`е`, `ё`);

    const findParams: Filter<
      sharedCategory.entities.CategoryEntity & StringId
    > = {
      $or: [
        {
          name: { $regex: new RegExp(search), $options: `si` },
        },
        {
          name: { $regex: new RegExp(search2), $options: `si` },
        },
        {
          description: { $regex: new RegExp(search), $options: `si` },
        },
        {
          description: { $regex: new RegExp(search2), $options: `si` },
        },
      ],
    };

    if (active !== undefined) {
      findParams.active = active;
    }

    return this.collection.find(findParams, { ...options }).toArray();
  }

  async save(
    category: sharedCategory.entities.CategoryEntity,
  ): Promise<sharedCategory.entities.CategoryEntity & StringId> {
    const newCategory = addId(category);
    try {
      await this.collection.insertOne(newCategory);
      return newCategory;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new sharedCategory.errors.CategoryAlreadyExistsError();
      }
      throw error;
    }
  }
}
