import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { type Observable } from 'rxjs';
import jwt from '../utils/jwt.utils';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const metadata = context.switchToRpc().getContext();

    const access_token = metadata.get('access_token');
    if (!access_token?.length)
      throw new RpcException({
        code: Status.UNAUTHENTICATED,
        message: 'missing or invalid token',
      });

    const { id, accountType } = jwt.verifyToken(access_token[0]);

    metadata.set('id', id);
    metadata.set('accountType', accountType);

    return next.handle().pipe();
  }
}
