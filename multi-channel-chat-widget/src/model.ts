export type ConversationType = "GROUP" | "ONE_TO_ONE";

export type ConversationChannel = "ZALO" | "FACEBOOK" | "WHATAPP" | "WEBSITE";

export type Conversation = {
  id?: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
  type: ConversationType;
  name: string;
  external_conversation_id: string;
  last_message_at: Date | null;
  last_message_summary: string | null;
  notes: string;
  is_chatbot_active: boolean;
  channel: ConversationChannel;
  messages: Message[];
  participants: Participant[];
};

// ----------------------------------------------------------------------

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE";

export type Message = {
  id?: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
  sender_id: string;
  sender_type: ParticipantType;
  content: string;
  type: MessageType;
  external_message_id?: string;
  attachments?: number[];
};

// ----------------------------------------------------------------------

export type ParticipantType = "CUSTOMER" | "STAFF" | "CHATBOT";

export type Participant = {
  id?: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
  participant_id: string;
  participant_type: ParticipantType;
  participant_name: string;
  participant_email: string;
  conversation?: string;
  participant_phone: string;
};

// ----------------------------------------------------------------------

export interface UserInfo {
  name: string;
  email: string;
  whatsapp: string;
  customerId?: string;
  conversationId?: string;
  token?: string;
}
