import type { RoomChatDocument } from '../models/room.schema';
import type { BasePaginationInput, FileInput } from '.';
import type { RoomType } from './schema';

export interface CreateRoomInput {
  users: string[];
  description?: string;
  name?: string;
  file?: FileInput | null;
}

export interface DeleteUserInput {
  userId: string;
  roomId: string;
}

export interface ListRoom {
  _id: RoomType | '';
  data: RoomChatDocument[];
  total: number;
}

export interface PaginationWithRoomType extends BasePaginationInput {
  type: RoomType | 'All';
}
