import { Injectable, NestInterceptor, ExecutionContext, CallHandler, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T> | T> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<SuccessResponse<T> | T> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile || data instanceof Buffer) {
          return data;
        }
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        } as SuccessResponse<T>;
      }),
    );
  }
}
