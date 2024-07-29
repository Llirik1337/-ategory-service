import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class CryptoConfig {
  @IsNumber()
  @Expose({ name: `CRYPTO_SALT_ROUNDS` })
  saltRounds = 10;
}
