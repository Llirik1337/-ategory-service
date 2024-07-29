/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type INestApplication } from '@nestjs/common';

import { randomInt } from 'crypto';
import { connect, type NatsConnection } from 'nats';
import { AppModule } from '../src/app.module';

describe(`UserController (e2e)`, () => {
  let app: INestApplication;
  let natsClient: NatsConnection;

  beforeEach(async () => {
    process.env.PORT = randomInt(40000, 60000).toString();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    natsClient = await connect({ servers: [process.env.NATS_URL!] });
    app = await AppModule.bootstrap();
  });

  afterEach(async () => {
    await app.close();
    await natsClient.close();
  });

  it.todo(`Should register user and send to message bus`);
  it.todo(`Should throw error on register same user`);
});
