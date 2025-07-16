import { Common } from "../common";
import { Message, MessageCreateRequest } from "../message/message";
import { Participant, ParticipantCreateRequest } from "../participants/participant";

export enum ConversationType {
  GROUP = "GROUP",
  ONE_TO_ONE = "ONE_TO_ONE",
}

export enum ConversationChannel {
  ZALO = "ZALO",
  FACEBOOK = "FACEBOOK",
  WHATAPP = "WHATAPP",
  WEBSITE = "WEBSITE"
}

export type Conversation = Common & {
  type: ConversationType;
  name: string;
  external_conversation_id: string;
  last_message_at: Date | null;
  last_message_summary: string | null;
  notes: string;
  is_chatbot_active: boolean;
  channel: ConversationChannel;
  messages: Message[];
  participants: Participant[]
};


export type ConversationCreateRequest = {
  type: ConversationType;
  name?: string;
  external_conversation_id?: string;
  last_message_at: Date | null;
  last_message_summary: string | null;
  notes?: string;
  is_chatbot_active: boolean;
  channel: ConversationChannel;
  messages: MessageCreateRequest[];
  participants: ParticipantCreateRequest[]
}