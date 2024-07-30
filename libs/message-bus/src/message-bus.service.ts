import { Inject, Injectable } from '@nestjs/common';
import {
  type NatsRecord,
  NatsRecordBuilder,
  ClientProxy,
} from '@nestjs/microservices';
import { defaultIfEmpty, firstValueFrom } from 'rxjs';
import { headers } from 'nats';
import { randomUUID } from 'crypto';
import { type EventsType, type CommandsType } from '@app/shared';
import { L } from '@app/logger';

@Injectable()
export class MessageBusService {
  constructor(
    @Inject(`CLIENT_PROXY`)
    private readonly clientProxy: ClientProxy,
  ) {}

  async send<Q extends keyof CommandsType>(
    pattern: Q,
    data: CommandsType[Q]['request'],
  ): Promise<CommandsType[Q]['response']> {
    const message = this.getMessage(data);

    L().log(`NATS Send ${pattern}`, message);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await firstValueFrom(
      this.clientProxy.send(pattern, message).pipe(defaultIfEmpty([])),
    );
  }

  async emit<Q extends keyof EventsType>(
    pattern: Q,
    data: EventsType[Q]['event'],
  ): Promise<void> {
    const message = this.getMessage(data);

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    L().log(`NATS Emit ${pattern}`, message);

    await firstValueFrom(
      this.clientProxy.emit(pattern, data).pipe(defaultIfEmpty([])),
    );
  }

  private getMessage(data: unknown): NatsRecord<unknown, unknown> {
    const storage = L().getStorage();

    const natsHeaders = headers();

    if (storage?.requestId !== undefined) {
      natsHeaders.set(`x-request-id`, storage.requestId);
      natsHeaders.set(`x-trace-id`, randomUUID());
    }

    return new NatsRecordBuilder(data).setHeaders(natsHeaders).build();
  }
}
