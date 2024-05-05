import { type ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';

config();

const packages = ['room', 'chat', 'global'];

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: packages,
    protoPath: packages.map((el) => join(__dirname, `../proto/${el}.proto`)),
    url: process.env.APPLICATION_URL ?? 'localhost:50055',
  },
};
