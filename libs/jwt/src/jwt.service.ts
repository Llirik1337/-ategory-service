import { Injectable } from '@nestjs/common';
import { type JwtPayload, sign, verify } from 'jsonwebtoken';
import { JwtConfig } from './jwt.config';

@Injectable()
export class JwtService {
  constructor(private readonly config: JwtConfig) {}
  sign(payload: string | Buffer | object): string {
    return sign(payload, this.config.secret);
  }

  verify(token: string): string | JwtPayload {
    return verify(token, this.config.secret);
  }
}
