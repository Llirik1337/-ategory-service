import { Exclude, Expose, Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class Config {
  @Expose({ name: `APP_PORT` })
  @IsNumber()
  @Transform(({ value }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof value === `string` ? parseInt(value) : value,
  )
  port = 3000;
}
