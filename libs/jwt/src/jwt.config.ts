import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JwtConfig {
  @Expose({ name: `JWT_SECRET` })
  secret = `secret`;
}
