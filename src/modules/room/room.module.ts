import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ROOM_PACKAGE } from '../../constants/room.constant';
import { grpcClientOptions } from '../../config/grpc.config';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomChatSchema } from '../../models/room.schema';
import { RoomValidator } from './room.validation';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ROOM_PACKAGE,
        ...grpcClientOptions,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Room',
        schema: RoomChatSchema,
      },
    ]),
  ],
  providers: [RoomService, RoomValidator],
  controllers: [RoomController],
})
export class RoomModule {}
