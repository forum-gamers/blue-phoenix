import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { Document } from "mongoose";
import type { ChatAttributes, RoomType, RoomUser } from "../interfaces/schema";

@Schema({ timestamps: true, collection: "Room" })
export class RoomChat {
  @Prop({ required: true, type: String, enum: ["Private", "Group"] })
  public type: RoomType;

  @Prop([
    {
      userId: {
        type: String,
        required: true,
      },
      addedAt: {
        type: Date,
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: ["Admin", "Member"],
      },
    },
  ])
  public users: RoomUser[];

  @Prop({ type: String, default: "N/A" })
  public description: string;

  @Prop({ type: String, required: false })
  public image?: string;

  @Prop({ type: String, required: false })
  public imageId?: string;

  @Prop({ type: String, required: false })
  public name?: string;

  @Prop({ type: String, required: false })
  public owner?: string;

  @Prop([
    {
      senderId: {
        type: String,
        required: true,
      },
      message: {
        type: String,
      },
      image: {
        type: String,
        required: false,
      },
      imageId: {
        type: String,
        required: false,
      },
      mediaType: {
        type: String,
        enum: ["image", "video"],
        required: false,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        enum: ["plain", "updated", "deleted"],
        default: "plain",
      },
      createdAt: {
        type: Date,
      },
      updatedAt: {
        type: Date,
      },
    },
  ])
  public chats: ChatAttributes[];
}

export type RoomChatDocument = Document & RoomChat;

export const RoomChatSchema = SchemaFactory.createForClass(RoomChat);
