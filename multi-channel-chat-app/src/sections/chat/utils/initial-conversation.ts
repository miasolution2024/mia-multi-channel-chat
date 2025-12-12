import { User } from "@/models/auth/user";
import {
  Conversation,
  ConversationChannel,
} from "@/models/conversation/conversations";
import { MessageCreateRequest, MessageType } from "@/models/message/message";
import {
  Participant,
  ParticipantType,
} from "@/models/participants/participant";

// ----------------------------------------------------------------------

export function initialConversation({
  message = "",
  me,
  selectedConversationId,
  conversation,
  selectedChannel,
}: {
  message?: string;
  me: User;
  selectedConversationId?: number;
  selectedChannel: ConversationChannel;
  conversation?: Conversation;
}): {
  messageData: MessageCreateRequest;
} {
  const sender = conversation?.participants.find(
    (participant: Participant) => participant.participant_id === me.id
  );

  const recipient = conversation?.participants.find(
    (participant: Participant) => participant.participant_id !== me.id
  );

  const messageData: MessageCreateRequest = {
    channel: selectedChannel,
    conversation: selectedConversationId ?? 0,
    attachments: [],
    content: message,
    type: MessageType.TEXT,
    sender_id: me.id,
    sender_type: ParticipantType.STAFF,
    external_receive_id: sender?.external_user_id,
    external_sender_id: recipient?.external_user_id,
  };

  return { messageData };
}
