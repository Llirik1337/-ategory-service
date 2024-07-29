import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import { type Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { type Response, type Request } from 'express';
import { performance } from 'node:perf_hooks';
import { type NatsContext } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { type MsgHdrsImpl } from 'nats';
import { ExtendedLoggerService } from './extended-logger.service';
import { L } from './index';
import { asyncLocalStorage } from './async-local-storage';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return this[context.getType()](context, next);
  }

  rpc(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = performance.now();
    const requestContext = context.switchToRpc().getContext<NatsContext>();

    const data = context.switchToRpc().getData<unknown>();

    const headers = requestContext.getHeaders() as MsgHdrsImpl;

    const requestId = headers.get(`x-request-id`) ?? randomUUID();
    const traceId = headers.get(`x-trace-id`) ?? randomUUID();

    const storage = {
      context: `NATS`,
      requestId,
      traceId,
    } as const;

    asyncLocalStorage.enterWith({
      ...storage,
      logger: ExtendedLoggerService.getLogger(storage),
    });

    L().log(`NATS Request ${requestContext.getSubject()}`, data);

    return next.handle().pipe(
      tap((payload: unknown) => {
        L().log(`NATS Response ${requestContext.getSubject()}`, {
          payload,
          durationMs: performance.now() - startTime,
        });
      }),
    );
  }

  http(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = performance.now();
    const request = context.switchToHttp().getRequest<Request>();

    const requestId = request.header(`x-request-id`) ?? randomUUID();
    const storage = {
      context: `HTTP`,
      requestId,
      traceId: randomUUID(),
    } as const;

    asyncLocalStorage.enterWith({
      ...storage,
      logger: ExtendedLoggerService.getLogger(storage),
    });

    L().log(
      `HTTP ${request.method.toLocaleUpperCase()} Request ${request.url}`,
      {
        headers: request.headers,
        query: request.query,
        params: request.params,
        body: request.body as unknown,
        cookie: request.cookies as unknown,
        method: request.method,
        url: request.url,
      },
    );

    return next.handle().pipe(
      tap((payload: unknown) => {
        const response = context.switchToHttp().getResponse<Response>();

        response.setHeader(`x-request-id`, requestId);

        L().log(
          `HTTP ${request.method.toLocaleUpperCase()} Response ${request.url}`,
          {
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
            headers: response.getHeaders(),
            durationMs: performance.now() - startTime,
            payload,
          },
        );
      }),
    );
  }

  ws(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = performance.now();

    return next.handle().pipe(
      tap((payload: unknown) => {
        L().log(`WS Response `, {
          payload,
          durationMs: performance.now() - startTime,
        });
      }),
    );
  }
}
