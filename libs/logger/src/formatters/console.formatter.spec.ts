import { type FormatterWriteParams } from './index';
import { ConsoleFormatter } from './console.formatter';

describe(ConsoleFormatter.name, () => {
  let formatter: ConsoleFormatter;

  const params: Omit<FormatterWriteParams, 'logLevel'> = {
    data: 123,
    message: `test`,
    requestId: `123123`,
    traceId: `123123`,
    service: `TEST`,
    context: undefined,
    timestamp: new Date(),
  };

  beforeAll(() => {
    formatter = new ConsoleFormatter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`Should write debug log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `debug`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it(`Should write error log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `error`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it(`Should write log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `log`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it(`Should write verbose log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `verbose`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it(`Should write warn log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `warn`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
