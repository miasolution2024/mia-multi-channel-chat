import { User } from "@/models/auth/user";
import {
  ConversationChannel,
  ConversationCreateRequest,
  ConversationType,
} from "@/models/conversation/conversations";
import { MessageCreateRequest, MessageType } from "@/models/message/message";
import {
  Participant,
  ParticipantType,
} from "@/models/participants/participant";

// ----------------------------------------------------------------------

export function initialConversation({
  message = "",
  recipients,
  me,
  selectedConversationId,
}: {
  message?: string;
  recipients: Participant[];
  me: User;
  selectedConversationId?: string;
}): {
  messageData: MessageCreateRequest;
  conversationData: ConversationCreateRequest;
} {
  const isGroup = recipients.length > 1;

  const messageData: MessageCreateRequest = {
    conversation: selectedConversationId ?? "",
    attachments: [],
    content: message,
    type: MessageType.TEXT,
    sender_id: me.id,
    sender_type: ParticipantType.STAFF
  };

  const conversationData: ConversationCreateRequest = {
    type: isGroup ? ConversationType.GROUP : ConversationType.ONE_TO_ONE,
    name: `Conversation with ${recipients[0]?.participant_name}`,
    channel: ConversationChannel.WEBSITE,
    last_message_at: new Date(),
    last_message_summary: message,
    is_chatbot_active: false,
    messages: [messageData],
    participants: [
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ...recipients.map(({ id, ...rest }) => ({
        ...rest,
      })),
      {
        participant_id: me.id,
        participant_name: me.full_name,
        participant_email: me.email,
        participant_avatar: me.avatar,
        participant_phone: "",
        participant_type: ParticipantType.STAFF,
      },
    ],
  };

  return { messageData, conversationData };
}
