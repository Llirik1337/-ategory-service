import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class ExtendedMongodbConfig {
  @IsString()
  @Expose({ name: `MONGODB_URL` })
  url = `mongodb://localhost:27017`;

  @IsString()
  @IsOptional()
  @Expose({ name: `MONGODB_DATABASE` })
  dataBase? = ``;
}
