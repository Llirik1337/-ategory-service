import { type CategoryEntity } from '../entities';
import { type Direction } from '../enum';

export interface FindRequestDTO {
  name?: string;
  description?: string;
  active?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sortDirection?: Direction;
  sortBy?: keyof CategoryEntity;
}
