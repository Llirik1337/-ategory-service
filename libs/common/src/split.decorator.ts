import { Transform } from 'class-transformer';

export const Split = (separator: string): PropertyDecorator =>
  Transform(({ value }: { value: any | undefined }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return value === `` ? [] : value?.split?.(separator);
  });
