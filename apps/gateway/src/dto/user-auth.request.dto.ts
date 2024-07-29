import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

@Exclude()
export class UserAuthRequestDTO {
  @IsEmail()
  @Expose()
  @ApiProperty({ example: `XN5f8@example.com` })
  email: string;

  @IsString()
  @Expose()
  @ApiProperty()
  password: string;
}
