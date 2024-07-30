import { registerDecorator, type ValidationOptions } from 'class-validator';

export function IsValidSlug(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  const regexp = /^.*[a-zA-Z0-9-]$/;

  return function (object: object, propertyName: string) {
    registerDecorator({
      name: `isValidSlug`,
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return typeof value === `string` && value.match(regexp) !== null;
        },
      },
    });
  };
}
