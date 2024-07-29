import { addId } from './add-id.helper';

describe(addId.name, () => {
  it(`should add an _id`, () => {
    expect(addId({})).toEqual(
      expect.objectContaining({ _id: expect.any(String) as string }),
    );
  });

  it(`should not mutate the original object`, () => {
    const obj = { foo: `bar` };
    addId(obj);
    expect(obj).toEqual({ foo: `bar` });
    expect(obj).not.toHaveProperty(`_id`);
  });
});
