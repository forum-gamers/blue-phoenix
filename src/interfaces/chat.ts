import type { FileInput } from ".";

export interface CreateChatInput {
  roomId: string;
  message?: string;
  file?: FileInput | null;
}

export interface SetReadInput {
  roomId: string;
  chatIds: string[];
}

export interface UpdateMsgInput {
  roomId: string;
  chatId: string;
  message: string;
}

export interface DeleteMsgInput {
  roomId: string;
  chatId: string;
}
