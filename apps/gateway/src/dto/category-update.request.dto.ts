import { IsValidSlug } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CategoryUpdateRequestDTO {
  @ApiProperty({ example: `category-1`, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  @IsValidSlug()
  slug?: string;

  @ApiProperty({ example: `Category 1`, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: `Category 1 description`, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @Expose()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
