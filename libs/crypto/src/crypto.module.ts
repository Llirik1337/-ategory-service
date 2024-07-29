import { type DynamicModule, Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { TypedConfigModule } from '@app/common';
import { CryptoConfig } from './crypto.config';
import * as bcrypt from 'bcrypt';

@Module({})
export class CryptoModule {
  static registry(config?: Partial<CryptoConfig>): DynamicModule {
    return {
      module: CryptoModule,
      imports: [TypedConfigModule.registry(CryptoConfig, config)],
      providers: [
        {
          provide: `SALT`,
          inject: [CryptoConfig],
          useFactory: async (config: CryptoConfig) => {
            return bcrypt.genSalt(config.saltRounds);
          },
        },
        CryptoService,
      ],
      exports: [CryptoService],
    };
  }
}
