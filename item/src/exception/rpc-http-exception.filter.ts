import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class Rpc2HttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.message.statusCode;

    var message = exception.message.response;
    if (!message) {
      message = { error: exception.message.error };
    }

    response
      .status(status)
      .json(message);
  }
}