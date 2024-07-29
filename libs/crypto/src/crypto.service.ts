import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptoConfig } from './crypto.config';

@Injectable()
export class CryptoService {
  constructor(
    private readonly config: CryptoConfig,
    @Inject(`SALT`)
    private readonly salt: string,
  ) {}

  async getHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
