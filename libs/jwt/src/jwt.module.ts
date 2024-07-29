import { type DynamicModule, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtConfig } from './jwt.config';
import { TypedConfigModule } from '@app/common';

@Module({})
export class JwtModule {
  static registry(config?: Partial<JwtConfig>): DynamicModule {
    return {
      module: JwtModule,
      imports: [TypedConfigModule.registry(JwtConfig, config)],
      providers: [JwtService],
      exports: [JwtService],
    };
  }
}
