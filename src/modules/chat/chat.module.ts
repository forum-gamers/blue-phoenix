import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ROOM_PACKAGE } from '../../constants/room.constant';
import { grpcClientOptions } from '../../config/grpc.config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomChatSchema } from '../../models/room.schema';
import { ChatController } from './chat.controller';
import { ChatValidator } from './chat.validations';
import { RoomService } from '../room/room.service';

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
  providers: [ChatValidator, RoomService],
  controllers: [ChatController],
})
export class ChatModule {}
