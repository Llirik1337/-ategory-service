import { randomUUID } from 'crypto';
import { GoogleFormatter, type GoogleMessage } from './google.formatter';
import { type FormatterWriteParams } from './index';

describe(GoogleFormatter.name, () => {
  let formatter: GoogleFormatter;
  const [traceId, requestId] = [randomUUID(), randomUUID()];
  const params: Omit<FormatterWriteParams, 'logLevel'> = {
    data: 123,
    message: `test`,
    service: `TEST`,
    timestamp: new Date(),
    requestId,
    traceId,
  };

  const expectedLogMessage: Omit<GoogleMessage, 'level'> = {
    data: 123,
    message: `test`,
    service: `TEST`,
    timestamp: params.timestamp.toISOString(),
    requestId,
    traceId,
  };

  beforeAll(() => {
    formatter = new GoogleFormatter();
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
    expect(logSpy).toHaveBeenCalledWith({
      ...expectedLogMessage,
      level: `DEBUG`,
    });
  });

  it(`Should write error log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `error`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      ...expectedLogMessage,
      level: `ERROR`,
    });
  });

  it(`Should write log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `log`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      ...expectedLogMessage,
      level: `LOG`,
    });
  });

  it(`Should write verbose log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `verbose`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      ...expectedLogMessage,
      level: `VERBOSE`,
    });
  });

  it(`Should write warn log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    formatter.write({
      ...params,
      logLevel: `warn`,
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      ...expectedLogMessage,
      level: `WARN`,
    });
  });
});
