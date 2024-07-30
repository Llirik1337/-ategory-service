import { IsValidSlug } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CategoryFindOneResponseDTO {
  @ApiProperty({ example: `5f5a8f7a-6f7a-8f7a-8f7a-8f7a8f7a8f7a` })
  @Expose()
  @IsString()
  id: string;

  @ApiProperty({ example: `category-1` })
  @Expose()
  @IsString()
  @IsValidSlug()
  slug: string;

  @ApiProperty({ example: `Category 1` })
  @Expose()
  @IsString()
  name: string;

  @ApiProperty({ example: `Category 1 description` })
  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true })
  @Expose()
  @IsBoolean()
  active: boolean;
}
