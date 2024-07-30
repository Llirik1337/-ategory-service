import { Controller } from '@nestjs/common';
import { CategoryService } from './services';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { category } from '@app/shared';
import { type StringId } from '@app/mongodb';

@Controller()
export class AppController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern(category.commands.create)
  async create(
    @Payload() payload: category.dto.CreateRequestDTO,
  ): Promise<category.entities.CategoryEntity & StringId> {
    return await this.categoryService.save(payload);
  }

  @MessagePattern(category.commands.update)
  async update(
    @Payload() payload: category.dto.UpdateRequestDTO,
  ): Promise<void> {
    await this.categoryService.update(payload.id, payload);
  }

  @MessagePattern(category.commands.delete)
  async delete(
    @Payload() payload: category.dto.DeleteRequestDTO,
  ): Promise<void> {
    await this.categoryService.delete(payload.id);
  }

  @MessagePattern(category.commands.findByIdOrSlug)
  async findByIdOrSlug(
    @Payload() payload: category.dto.FindOneRequestDTO,
  ): Promise<category.dto.FindOneResponseDTO> {
    const result = await this.categoryService.findByIdOrSlug(payload.idOrSlug);

    const { _id, ...rest } = result;

    return {
      ...rest,
      id: _id,
    };
  }

  @MessagePattern(category.commands.find)
  async find(
    @Payload() payload: category.dto.FindRequestDTO,
  ): Promise<category.dto.FindOneResponseDTO[]> {
    return (await this.categoryService.find(payload)).map(
      ({ _id, ...rest }) => ({ id: _id, ...rest }),
    );
  }
}
