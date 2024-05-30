import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import type { Metadata } from '@grpc/grpc-js';
import { Status } from '@grpc/grpc-js/build/src/constants';
import helpers from '../../helpers';
import { CHAT_SERVICE } from '../../constants/chat.constant';
import { CHAT_SERVICE_METHOD } from '../../enum/chat.enum';
import { ChatValidator } from './chat.validations';
import { Types } from 'mongoose';
import { RoomService } from '../room/room.service';
import type { ChatAttributes, ChatMediaType } from '../../interfaces/schema';
import encryption from '../../utils/encryption';

@Controller()
export class ChatController {
  constructor(
    private readonly chatValidator: ChatValidator,
    private readonly roomService: RoomService,
  ) {}

  @GrpcMethod(CHAT_SERVICE, CHAT_SERVICE_METHOD.CREATECHAT)
  public async createChat(payload: any, metadata: Metadata) {
    const { id } = helpers.getUserFromMetadata(metadata);
    const { message, roomId, file } =
      await this.chatValidator.validateCreateChat(payload);

    const roomObjectId = new Types.ObjectId(roomId);

    const data = await this.roomService.findById(roomObjectId);
    if (!data)
      throw new RpcException({
        message: 'data not found',
        code: Status.NOT_FOUND,
      });

    if (!data.users.find((el) => el.userId === id))
      throw new RpcException({
        message: 'unauthorized',
        code: Status.PERMISSION_DENIED,
      });

    const chat: ChatAttributes = {
      senderId: id,
      isRead: false,
      status: 'plain',
    } as ChatAttributes;

    if (message) chat.message = encryption.encrypt(message);

    if (file) {
      const { url, fileId } = file;

      const [type] = file.contentType.split('/');
      chat.image = url;
      chat.imageId = fileId;
      chat.mediaType = type.toLowerCase() as ChatMediaType;
    }

    chat.createdAt = new Date();
    chat.updatedAt = new Date();

    await this.roomService.createChat(roomObjectId, chat);

    return chat;
  }

  @GrpcMethod(CHAT_SERVICE, CHAT_SERVICE_METHOD.SETREAD)
  public async setRead(payload: any, metadata: Metadata) {
    const { id } = helpers.getUserFromMetadata(metadata);
    const { roomId, chatIds } =
      await this.chatValidator.validateSetRead(payload);

    const roomObjectId = new Types.ObjectId(roomId);

    const data = await this.roomService.findById(roomObjectId);
    if (!data)
      throw new RpcException({
        message: 'data not found',
        code: Status.NOT_FOUND,
      });

    const query: any = {
      $set: {},
    };

    for (const chatId of chatIds) {
      const idx = data.chats.findIndex((el) => el._id.toString() === chatId);
      if (idx !== -1 && data.chats[idx].senderId !== id)
        query.$set[`chats.${idx}.isRead`] = true;
    }

    await this.roomService.updateByQuery(roomObjectId, query);

    return { message: 'success' };
  }

  @GrpcMethod(CHAT_SERVICE, CHAT_SERVICE_METHOD.EDITMESSAGE)
  public async editMsg(payload: any, metadata: Metadata) {
    const { id } = helpers.getUserFromMetadata(metadata);
    const { chatId, roomId, message } =
      await this.chatValidator.validateEditMsg(payload);

    const roomObjectId = new Types.ObjectId(roomId);

    const data = await this.roomService.findById(roomObjectId);
    if (!data)
      throw new RpcException({
        message: 'data not found',
        code: Status.NOT_FOUND,
      });

    const chatIdx = data.chats.findIndex((el) => el._id.toString() === chatId);
    if (chatIdx === -1)
      throw new RpcException({
        message: 'chat not found',
        code: Status.NOT_FOUND,
      });

    if (data.chats[chatIdx].senderId !== id)
      throw new RpcException({
        message: 'Forbidden',
        code: Status.PERMISSION_DENIED,
      });

    await this.roomService.updateChatMsg(
      roomObjectId,
      chatIdx,
      encryption.encrypt(message),
    );

    return { message: 'success' };
  }

  @GrpcMethod(CHAT_SERVICE, CHAT_SERVICE_METHOD.DELETEMESSAGE)
  public async deleteMsg(payload: any, metadata: Metadata) {
    const { id } = helpers.getUserFromMetadata(metadata);
    const { chatId, roomId } =
      await this.chatValidator.validateDeleteMsg(payload);

    const roomObjectId = new Types.ObjectId(roomId);

    const data = await this.roomService.findById(roomObjectId);
    if (!data)
      throw new RpcException({
        message: 'data not found',
        code: Status.NOT_FOUND,
      });

    const chatIdx = data.chats.findIndex((el) => el._id.toString() === chatId);
    if (chatIdx === -1)
      throw new RpcException({
        message: 'chat not found',
        code: Status.NOT_FOUND,
      });

    if (data.chats[chatIdx].senderId !== id)
      throw new RpcException({
        message: 'Forbidden',
        code: Status.PERMISSION_DENIED,
      });

    if (data.chats[chatIdx].status === 'deleted')
      throw new RpcException({
        message: 'Conflict',
        code: Status.ALREADY_EXISTS,
      });

    await this.roomService.deleteChatMsg(roomObjectId, chatIdx);

    return { message: 'success' };
  }
}
