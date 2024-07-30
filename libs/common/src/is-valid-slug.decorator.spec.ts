/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { validateSync } from 'class-validator';
import { IsValidSlug } from './is-valid-slug.decorator';

class Test {
  @IsValidSlug()
  slug: string;
}
describe(`IsValidSlug`, () => {
  it(`should validate`, () => {
    const test = new Test();
    test.slug = `test-123-Test`;
    const errors = validateSync(test);
    expect(errors.length).toBe(0);
  });

  it(`should not validate`, () => {
    const test = new Test();
    test.slug = `ТЕСТ`;
    const errors = validateSync(test);
    expect(errors.length).toBe(1);
  });
});
