import { category } from '@app/shared';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

@Exclude()
export class Config {
  @Expose({ name: `DEFAULT_PAGE_SIZE` })
  @IsInt()
  @Min(1)
  @Max(9)
  defaultPageSize = 2;

  @Expose({ name: `DEFAULT_SORT_DIRECTION` })
  @IsEnum(category.enum.Direction)
  deafultSortDirection = category.enum.Direction.DESC;

  @Expose({ name: `DEFAULT_SORT_BY` })
  @IsString()
  defaultSortBy: keyof category.entities.CategoryEntity = `createdDate`;
}
