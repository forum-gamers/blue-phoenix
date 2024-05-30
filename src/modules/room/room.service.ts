import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  type Model,
  Types,
  type UpdateQuery,
  type PipelineStage,
} from 'mongoose';
import type { RoomChatDocument } from '../../models/room.schema';
import type { ChatAttributes, RoomType } from '../../interfaces/schema';
import type { ListRoom } from 'src/interfaces/room';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room')
    private readonly roomRepo: Model<RoomChatDocument>,
  ) {}

  public async createRoom(data: RoomChatDocument) {
    return await this.roomRepo.create(data);
  }

  public async findById(id: Types.ObjectId | string) {
    return await this.roomRepo.findById(id);
  }

  public async pullUser(roomId: Types.ObjectId, userId: string) {
    return await this.roomRepo.findOneAndUpdate(
      { _id: roomId },
      { $pull: { users: { userId } } },
      {
        new: true,
      },
    );
  }

  public async updateByQuery(
    _id: Types.ObjectId,
    query: UpdateQuery<RoomChatDocument>,
  ) {
    return await this.roomRepo.findOneAndUpdate({ _id }, query, {
      new: true,
    });
  }

  public async updateUserRole(
    _id: Types.ObjectId,
    idx: number,
    status: 'Admin' | 'Member',
  ) {
    return await this.roomRepo.findOneAndUpdate(
      { _id },
      {
        $set: {
          [`users.${idx}.role`]: status,
        },
      },
      {
        new: true,
      },
    );
  }

  public async createChat(_id: Types.ObjectId, chat: ChatAttributes) {
    return await this.roomRepo.findOneAndUpdate(
      { _id },
      {
        $push: {
          chats: chat,
        },
      },
      {
        new: true,
      },
    );
  }

  public async updateChatMsg(
    _id: Types.ObjectId,
    idx: number,
    message: string,
  ) {
    return await this.roomRepo.findOneAndUpdate(
      { _id },
      {
        $set: {
          [`chats.${idx}.message`]: message,
          [`chats.${idx}.status`]: 'updated',
        },
      },
      {
        new: true,
      },
    );
  }

  public async deleteChatMsg(_id: Types.ObjectId, idx: number) {
    return await this.roomRepo.findOneAndUpdate(
      { _id },
      {
        $set: {
          [`chats.${idx}.status`]: 'deleted',
        },
      },
      {
        new: true,
      },
    );
  }

  public async getUserRoom(
    userId: string,
    type: RoomType | 'All' = 'All',
    $skip = 0,
    $limit = 20,
  ): Promise<ListRoom> {
    try {
      const match: PipelineStage.Match = {
        $match: {
          users: {
            $elemMatch: { userId },
          },
        },
      };
      if (type && ['Private', 'Group'].includes(type)) match.$match.type = type;

      const [result] = await this.roomRepo.aggregate<ListRoom>([
        match,
        {
          $facet: {
            data: [
              { $skip },
              { $limit },
              {
                $project: {
                  type: 1,
                  users: {
                    $slice: ['$users.userId', 0, 5],
                  },
                  image: 1,
                  name: 1,
                  chats: {
                    $slice: ['$chats', 0, 15],
                  },
                },
              },
            ],
            total: [{ $count: 'total' }],
          },
        },
        { $unwind: '$total' },
        { $unwind: '$data' },
        {
          $group: {
            _id: '$data.type',
            data: {
              $push: '$$ROOT.data',
            },
            total: {
              $first: '$total.total',
            },
          },
        },
      ]);
      if (!result) throw new Error();

      return result;
    } catch (err) {
      return {
        _id: '',
        data: [],
        total: 0,
      };
    }
  }

  public async findByUserId(userId: string) {
    return await this.roomRepo.findOne({
      'users.userId': userId,
      type: 'Private',
    });
  }
}
