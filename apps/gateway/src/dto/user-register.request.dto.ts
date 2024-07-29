import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

@Exclude()
export class UserRegisterRequestDTO {
  @IsEmail()
  @Expose()
  @ApiProperty({ example: `WQqzK@example.com` })
  email: string;

  @IsString()
  @Expose()
  @ApiProperty({ example: `1234567` })
  password: string;
}
