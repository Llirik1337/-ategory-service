import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { category } from '@app/shared';
import { Config } from '../config';
import { type StringId } from '@app/mongodb';

const DEFAULT_PAGE = 0;

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly config: Config,
  ) {}

  async findByIdOrSlug(
    idOrSlug: string,
  ): Promise<category.entities.CategoryEntity & StringId> {
    const result = await this.categoryRepository.findByIdOrSlug(idOrSlug);

    if (result == null) {
      throw new category.errors.CategoryNotExistError();
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.deleteById(id);
  }

  async update(
    id: string,
    category: Partial<Omit<category.entities.CategoryEntity, 'createdDate'>>,
  ): Promise<category.entities.CategoryEntity & StringId> {
    return await this.categoryRepository.update(id, category);
  }

  async save(
    category: Omit<category.entities.CategoryEntity, 'createdDate'>,
  ): Promise<category.entities.CategoryEntity & StringId> {
    return await this.categoryRepository.save({
      ...category,
      createdDate: new Date(),
    });
  }

  async find(
    params: Partial<
      Pick<
        category.entities.CategoryEntity,
        'name' | 'description' | 'active'
      > & {
        search: string;
        pageSize: number;
        page: number;
        sortDirection?: category.enum.Direction;
        sortBy?: keyof category.entities.CategoryEntity;
      }
    >,
  ): Promise<Array<category.entities.CategoryEntity & StringId>> {
    const {
      name,
      description,
      active,
      search,
      page = DEFAULT_PAGE,
      pageSize = this.config.defaultPageSize,
      sortBy = this.config.defaultSortBy,
      sortDirection = this.config.deafultSortDirection,
    } = params;

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortDirection,
    };

    const options = {
      skip: page * pageSize,
      limit: pageSize,
      sort,
    };

    if (search !== undefined) {
      return this.categoryRepository.findWithSearch(
        {
          search,
          active,
        },
        options,
      );
    }

    const filter: Partial<
      Pick<category.entities.CategoryEntity, 'name' | 'description' | 'active'>
    > = {};

    if (name !== undefined) {
      filter.name = name;
    }

    if (description !== undefined) {
      filter.description = description;
    }

    if (active !== undefined) {
      filter.active = active;
    }

    return this.categoryRepository.find(filter, options);
  }
}
