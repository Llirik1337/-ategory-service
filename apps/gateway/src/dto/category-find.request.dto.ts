import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

const TransformBoolean = (): PropertyDecorator => {
  return Transform(
    ({ value }) => typeof value === `string` && value === `true`,
  );
};

const TransformInt = (): PropertyDecorator => {
  return Transform(
    ({ value }: { value: unknown }) =>
      typeof value === `string` && parseInt(value),
  );
};

@Exclude()
export class CategoryFindRequestDTO {
  @ApiProperty({ example: `Category 1`, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: `Category description`, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @Expose()
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  active?: boolean;

  @ApiProperty({ example: `Categ`, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: 2, required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  @TransformInt()
  pageSize?: number;

  @ApiProperty({ example: 1, required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  @TransformInt()
  page?: number;

  @ApiProperty({ example: `-name`, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  sort?: string;
}
