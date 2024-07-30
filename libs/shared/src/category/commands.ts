import { type CommandType } from '@app/common';
import {
  type FindOneRequestDTO,
  type FindOneResponseDTO,
  type FindRequestDTO,
  type CreateRequestDTO,
  type DeleteRequestDTO,
  type UpdateRequestDTO,
} from './dto';

export const commands = {
  create: `category:create`,
  delete: `category:delete`,
  update: `category:update`,
  findByIdOrSlug: `category:findByIdOrSlug`,
  find: `category:find`,
} satisfies Record<string, `category:${string}`>;

export interface CommandsType {
  [commands.create]: CommandType<CreateRequestDTO>;
  [commands.delete]: CommandType<DeleteRequestDTO>;
  [commands.update]: CommandType<UpdateRequestDTO>;
  [commands.findByIdOrSlug]: CommandType<FindOneRequestDTO, FindOneResponseDTO>;
  [commands.find]: CommandType<FindRequestDTO, FindOneResponseDTO[]>;
}
