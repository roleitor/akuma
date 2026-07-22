import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCodes } from '@shared/errors/error-codes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: unknown, user: unknown): any {
    if (err || !user) {
      throw new UnauthorizedException({
        code: ErrorCodes.UNAUTHORIZED.code,
        message: ErrorCodes.UNAUTHORIZED.message,
      });
    }
    return user;
  }
}
