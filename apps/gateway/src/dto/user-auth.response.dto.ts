import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsJWT } from 'class-validator';

@Exclude()
export class UserAuthResponseDTO {
  @Expose()
  @IsJWT()
  @ApiProperty({
    example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ5NzYzNjQyLCJleHAiOjE2NDk3NzE2NDJ9.3E9tSj0cTmZzjB9s2Rj6lHtZB4U0k0X0X0nYh8xVdJk`,
  })
  accessToken: string;

  @Expose()
  @IsJWT()
  @ApiProperty({
    example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ5NzYzNjQyLCJleHAiOjE2NDk3NzE2NDJ9.3E9tSj0cTmZzjB9s2Rj6lHtZB4U0k0X0X0nYh8xVdJk`,
  })
  refreshToken: string;
}
