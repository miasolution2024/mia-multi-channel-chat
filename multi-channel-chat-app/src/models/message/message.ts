import { Common } from "../common";
import { ParticipantType } from "../participants/participant";

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  FILE = "FILE",
}

export type Message = Common & {
  conversation: string;
  sender_id: string;
  sender_type: ParticipantType;
  content: string;
  type: MessageType;
  external_message_id: string;
  attachments: number[];
};

export type MessageCreateRequest ={
  conversation: string,
  sender_id: string;
  sender_type: ParticipantType;
  content: string;
  type: MessageType;
  external_message_id?: string;
  attachments: number[];
};

