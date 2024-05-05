import type { Types } from "mongoose";

export type RoomType = "Private" | "Group";

export interface RoomUser {
  userId: string;
  addedAt: Date;
  role: RoomRole;
}

export type RoomRole = "Admin" | "Member";

export interface ChatAttributes {
  senderId: string;
  message?: string;
  image?: string;
  imageId?: string;
  isRead: boolean;
  status: ChatStatus;
  mediaType?: ChatMediaType;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
}

export type ChatStatus = "plain" | "updated" | "deleted";

export type ChatMediaType = "image" | "video";
