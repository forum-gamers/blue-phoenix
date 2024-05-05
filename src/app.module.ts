import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { RoomModule } from './modules/room/room.module';
import { ChatModule } from './modules/chat/chat.module';

config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      waitQueueTimeoutMS: 1000 * 30,
    }),
    RoomModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
