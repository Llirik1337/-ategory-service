import { MessageBusService } from '@app/message-bus';
import { Injectable } from '@nestjs/common';
import { commands } from './commands';
import {
  type CreateRequestDTO,
  type UpdateRequestDTO,
  type FindOneResponseDTO,
  type FindRequestDTO,
} from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly messageBus: MessageBusService) {}

  async create(payload: CreateRequestDTO): Promise<void> {
    await this.messageBus.send(commands.create, payload);
  }

  async update(payload: UpdateRequestDTO): Promise<void> {
    await this.messageBus.send(commands.update, payload);
  }

  async deleteById(id: string): Promise<void> {
    await this.messageBus.send(commands.delete, {
      id,
    });
  }

  async findByIdOrSlug(idOrSlug: string): Promise<FindOneResponseDTO> {
    return await this.messageBus.send(commands.findByIdOrSlug, { idOrSlug });
  }

  async find(payload: FindRequestDTO): Promise<FindOneResponseDTO[]> {
    return await this.messageBus.send(commands.find, payload);
  }
}
