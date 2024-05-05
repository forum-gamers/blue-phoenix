import { Status } from '@grpc/grpc-js/build/src/constants';
import { RpcException } from '@nestjs/microservices';
import {
  type JwtPayload,
  verify,
  decode,
  type DecodeOptions,
} from 'jsonwebtoken';
import type { AccountType } from 'src/interfaces';

export type JwtValue = JwtPayload & TokenValue;

export interface TokenValue {
  id: string;
  accountType: AccountType;
}

export default new (class JWT {
  public verifyToken(token: string) {
    try {
      return verify(token, process.env.SECRET) as JwtValue;
    } catch (err) {
      throw new RpcException({
        message: 'missing or invalid token',
        code: Status.UNAUTHENTICATED,
      });
    }
  }

  public decodeToken(token: string, opts?: DecodeOptions) {
    return decode(token, opts) as JwtValue;
  }
})();
