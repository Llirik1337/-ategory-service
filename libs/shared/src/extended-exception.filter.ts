/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { L } from '@app/logger';
import { type ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { type NatsContext } from '@nestjs/microservices';
import { type Request, type Response } from 'express';
import { type Observable, throwError } from 'rxjs';
import { type BaseError } from './base-error';
import * as errors from './errors';

const errorsMap = new Map(
  Object.values(errors).map((error) => [error.name, error]),
);

@Catch()
export class ExtendedExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const hostType = host.getType();

    return this[hostType](exception, host);
  }

  static getError(exception: any): BaseError | undefined {
    const ErrorClass = errorsMap.get(exception?.name);

    if (ErrorClass !== undefined) {
      return Object.assign(new ErrorClass(), exception) as BaseError;
    }
  }

  http(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const storage = L().getStorage();

    if (storage?.requestId !== undefined) {
      response.setHeader(`x-request-id`, storage.requestId);
    }

    let errorData: any = ExtendedExceptionFilter.getError(exception)?.toHttp();
    let statusCode = 400;

    if (errorData == null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errorData = exception.message;
      statusCode = 500;
    }

    L().log(`HTTP Response ${request.method} ${request.url}`, errorData);

    response.status(statusCode).json(errorData);
  }

  rpc(exception: any, host: ArgumentsHost): Observable<never> {
    const argumentsHost = host.switchToRpc();

    const context: NatsContext = argumentsHost.getContext();

    const errorData = ExtendedExceptionFilter.getError(exception)?.toRpc();

    if (errorData == null) {
      L().log(`NATS Response ${context.getSubject()}`, exception);

      super.catch(exception, host);
    }

    L().log(`NATS Response ${context.getSubject()}`, errorData);

    return throwError(() => errorData);
  }

  ws(exception: unknown, host: ArgumentsHost): void {
    super.catch(exception, host);
  }
}
