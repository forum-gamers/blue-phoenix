import {
  Injectable,
  NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log(`${new Date()}: ${context.getArgs()[2].call.handler.path}`);
    return next.handle().pipe();
  }
}
