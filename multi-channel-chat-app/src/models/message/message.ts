import { Common } from "../common";
import { ConversationChannel } from "../conversation/conversations";
import { ParticipantType } from "../participants/participant";

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  FILE = "FILE",
  AUDIO = "AUDIO",
}

export type Message = Common & {
  conversation: string;
  sender_id: string;
  sender_type: ParticipantType;
  content: string;
  type: MessageType;
  external_message_id: string;
  attachments: Attachment[];
  translated_message: string | null;
  original_language: string | null;
  ai_reply_message_suggestion: string | null;
};

export type MessageCreateRequest = {
  channel: ConversationChannel;
  conversation: number;
  sender_id: string;
  sender_type: ParticipantType;
  content: string;
  type: MessageType;
  external_message_id?: string;
  customer_id?: string;
  attachments: {
    id: string;
    fileExtension: string;
    fileName: string;
  }[];
  external_receive_id?: string;
  external_sender_id?: string;
  original_language?: string | 'vi';
};

export type Attachment = {
  id: number;
  mc_messages_id: number;
  directus_files_id: DirectusFile;
};

export type DirectusFile = {
  id: string;
  storage: string;
  filename_download: string;
  type: string;
  filesize: number;
  created_on: Date;
  modified_on: Date;
};
