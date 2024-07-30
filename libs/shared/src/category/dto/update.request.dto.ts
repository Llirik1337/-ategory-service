import { type CreateRequestDTO } from './create.request.dto';

export type UpdateRequestDTO = {
  id: string;
} & Partial<CreateRequestDTO>;
