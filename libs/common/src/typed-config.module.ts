import { type DynamicModule, Module } from '@nestjs/common';
import { type ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

@Module({})
export class TypedConfigModule {
  static registry<T extends object>(
    ConfigClass: ClassConstructor<T>,
    overwriteValues: Partial<T> = {},
  ): DynamicModule {
    return {
      module: TypedConfigModule,
      providers: [
        {
          provide: ConfigClass,
          useFactory: () => {
            const config = Object.assign(
              plainToClass(ConfigClass, process.env, {
                exposeDefaultValues: true,
                enableImplicitConversion: true,
              }),
              overwriteValues,
            );

            const validationErrors = validateSync(config);

            if (validationErrors.length > 0) {
              throw new Error(
                JSON.stringify(
                  {
                    configClass: ConfigClass.name,
                    errors: validationErrors,
                  },
                  undefined,
                  2,
                ),
              );
            }

            return config;
          },
        },
      ],
      exports: [ConfigClass],
    };
  }
}
