import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CategoryCreateRequestDTO,
  CategoryFindOneResponseDTO,
  CategoryFindRequestDTO,
} from '../../../dto';
import { category } from '@app/shared';

@ApiTags(`category`)
@Controller(`v1/public/category`)
export class CategoryController {
  constructor(private readonly categoryService: category.CategoryService) {}

  @Post()
  public async create(
    @Body() payload: CategoryCreateRequestDTO,
  ): Promise<void> {
    await this.categoryService.create(payload);
  }

  @ApiParam({ name: `id`, example: `35fc537a-33ba-4cfc-aff2-ec433e61623e` })
  @Delete(`:id`)
  async delete(@Param(`id`) id: string): Promise<void> {
    await this.categoryService.deleteById(id);
  }

  @ApiParam({ name: `id`, example: `35fc537a-33ba-4cfc-aff2-ec433e61623e` })
  @Patch(`:id`)
  async update(
    @Param(`id`) id: string,
    @Body() payload: CategoryCreateRequestDTO,
  ): Promise<void> {
    await this.categoryService.update({ ...payload, id });
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: CategoryFindOneResponseDTO,
    isArray: true,
  })
  async find(
    @Query() payload: CategoryFindRequestDTO,
  ): Promise<CategoryFindOneResponseDTO[]> {
    const filter: category.dto.FindRequestDTO = {
      name: payload.name,
      description: payload.description,
      active: payload.active,
      search: payload.search,
      pageSize: payload.pageSize,
      page: payload.page,
      ...(payload.sort !== undefined && {
        sortBy: payload.sort.replace(
          /^-/,
          ``,
        ) as keyof category.entities.CategoryEntity,
        sortDirection: payload.sort.startsWith(`-`)
          ? category.enum.Direction.DESC
          : category.enum.Direction.ASC,
      }),
    };
    return await this.categoryService.find(filter);
  }

  @ApiParam({ name: `id_or_slug`, example: `category-1` })
  @Get(`:id_or_slug`)
  @ApiResponse({
    status: 200,
    type: CategoryFindOneResponseDTO,
  })
  async findOne(
    @Param(`id_or_slug`) idOrSlug: string,
  ): Promise<CategoryFindOneResponseDTO> {
    return await this.categoryService.findByIdOrSlug(idOrSlug);
  }
}
