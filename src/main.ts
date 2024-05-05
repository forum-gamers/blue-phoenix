import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './middlewares/logger.middlewares';
import { grpcClientOptions } from './config/grpc.config';
import { AuthenticationInterceptor } from './middlewares/authentication.middleware';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    grpcClientOptions,
  );

  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalInterceptors(new AuthenticationInterceptor());

  await app.listen();
}
bootstrap();
