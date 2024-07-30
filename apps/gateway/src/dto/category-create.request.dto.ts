import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CategoryCreateRequestDTO {
  @ApiProperty({ example: `category-1` })
  @Expose()
  @IsString()
  slug: string;

  @ApiProperty({ example: `Category 1` })
  @Expose()
  @IsString()
  name: string;

  @ApiProperty({ example: `Category 1 description`, required: false })
  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true })
  @Expose()
  @IsBoolean()
  active: boolean;
}
