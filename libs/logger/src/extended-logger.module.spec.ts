import { Test, type TestingModule } from '@nestjs/testing';
import { ExtendedLoggerModule } from './extended-logger.module';
import { ExtendedLoggerService } from './extended-logger.service';
import { faker } from '@faker-js/faker';
import { asyncLocalStorage } from './async-local-storage';
import { L } from './index';

describe(`${ExtendedLoggerModule.name} with formatter - google`, () => {
  let service: ExtendedLoggerService;
  let moduleRef: TestingModule;

  const serviceName = `TEST`;

  beforeAll(async () => {
    process.env.LOGGER_FORMATTER = `google`;
    process.env.LOGGER_SERVICE_NAME = serviceName;

    moduleRef = await Test.createTestingModule({
      imports: [ExtendedLoggerModule],
    }).compile();

    service = moduleRef.get(ExtendedLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it(`Should write debug log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    const message = faker.word.adjective();
    const data = faker.number.hex();

    service.debug(message, data);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      level: `DEBUG`,
      message,
      data,
      service: serviceName,
      timestamp: expect.any(String) as string,
    });
  });

  it(`Should write error log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    const message = faker.word.adjective();
    const data = faker.number.hex();

    service.error(message, data);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      level: `ERROR`,
      message,
      data,
      service: serviceName,
      timestamp: expect.any(String) as string,
    });
  });

  it(`Should write log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    const message = faker.word.adjective();
    const data = faker.number.hex();

    service.log(message, data);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      level: `LOG`,
      message,
      data,
      service: serviceName,
      timestamp: expect.any(String) as string,
    });
  });

  it(`Should write verbose log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    const message = faker.word.adjective();
    const data = faker.number.hex();

    service.verbose(message, data);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      level: `VERBOSE`,
      message,
      data,
      service: serviceName,
      timestamp: expect.any(String) as string,
    });
  });

  it(`Should write warn log`, () => {
    const logSpy = jest.spyOn(console, `log`);

    const message = faker.word.adjective();
    const data = faker.number.hex();

    service.warn(message, data);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith({
      level: `WARN`,
      message,
      data,
      service: serviceName,
      timestamp: expect.any(String) as string,
    });
  });

  it(`Should get existed logger from asyncLocalStorage`, () => {
    const storageBefore = asyncLocalStorage.getStore();

    const logger = L();
    const logger2 = L();

    const storageAfter = asyncLocalStorage.getStore();

    expect(storageBefore).toStrictEqual(undefined);
    expect(logger).toBeInstanceOf(ExtendedLoggerService);
    expect(logger2).toBeInstanceOf(ExtendedLoggerService);
    expect(logger2).toStrictEqual(logger);
    expect(storageAfter?.logger).toStrictEqual(logger);
  });
});

describe(`ExtendedLoggerService with disabled logLevels`, () => {
  let service: ExtendedLoggerService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    process.env.LOGGER_LOG_LEVELS = ``;

    moduleRef = await Test.createTestingModule({
      imports: [ExtendedLoggerModule],
    }).compile();

    service = moduleRef.get(ExtendedLoggerService);
  });

  it(`Should not write any message if logLevels is empty array`, () => {
    const logSpy = jest.spyOn(console, `log`);
    const warnSpy = jest.spyOn(console, `warn`);
    const errorSpy = jest.spyOn(console, `error`);

    service.debug(`test`);
    service.error(`test`);
    service.log(`test`);
    service.verbose(`test`);
    service.warn(`test`);

    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(warnSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
