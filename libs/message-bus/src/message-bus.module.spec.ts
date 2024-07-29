import { connect, JSONCodec, type NatsConnection } from 'nats';
import { MessageBusService } from './message-bus.service';
import { Test, type TestingModule } from '@nestjs/testing';
import { MessageBusModule } from './message-bus.module';

describe(MessageBusModule.name, () => {
  let service: MessageBusService;
  let nc: NatsConnection;
  let moduleRef: TestingModule;
  const queue = `TEST`;

  beforeAll(async () => {
    process.env.NATS_QUEUE = queue;

    moduleRef = await Test.createTestingModule({
      imports: [MessageBusModule],
    }).compile();

    service = moduleRef.get(MessageBusService);

    nc = await connect({
      servers: process.env.NATS_URL!,
    });
  });

  afterAll(async () => {
    await moduleRef.close();
    await nc.close();
  });

  // TODO: Fixed test
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip(`Should successful send`, async () => {
    const subject = `TEST`;
    const expectedResult = `Hello`;
    const expectedData = `World`;
    const jsonCodec = JSONCodec<any>();

    const sub = nc.subscribe(subject, {
      queue,
      callback(err, msg) {
        if (err != null) {
          throw err;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { pattern, data } = jsonCodec.decode(msg.data);

        expect(pattern).toStrictEqual(subject);
        expect(data).toStrictEqual(expectedData);

        msg.respond(jsonCodec.encode(expectedResult), {
          headers: msg.headers,
          reply: msg.reply,
        });
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await service.send(subject as any, expectedData);

    expect(result).toStrictEqual(expectedResult);

    sub.unsubscribe(0);
  });
});
