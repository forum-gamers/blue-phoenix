import { type Metadata } from '@grpc/grpc-js';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { RpcException } from '@nestjs/microservices';
import type { RoomChatDocument } from '../models/room.schema';
import encryption from '../utils/encryption';

export default new (class Helper {
  public getUserFromMetadata(metadata: Metadata) {
    const id = metadata.get('id');
    const accountType = metadata.get('accountType');
    if (!id?.length || !accountType?.length)
      throw new RpcException({
        code: Status.INTERNAL,
        message: 'Internal Server Error',
      });

    return {
      id: id[0] as string,
      accountType: accountType[0] as string,
    };
  }

  public getMetadata = (total: number, page: number, limit: number) => ({
    totalData: total,
    page,
    limit,
    totalPage: Math.ceil(total / limit),
  });

  public decryptChats(data: RoomChatDocument[]) {
    return data.map((data) => ({
      ...data,
      chats: data.chats
        .map((chat) => ({
          ...chat,
          message: chat.message ? encryption.decrypt(chat.message) : '',
        }))
        .filter((el) => el.status !== 'deleted'),
    }));
  }
})();
