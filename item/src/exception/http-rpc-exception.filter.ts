import { ArgumentsHost, Catch, RpcExceptionFilter, HttpException, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(HttpException)
export class Http2RpcExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): Observable<any> {
    return throwError(new RpcException(exception));
  }
}