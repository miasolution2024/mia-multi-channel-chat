import { User } from "@/models/auth/user";
import {
  Conversation,
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
  conversation,
}: {
  message?: string;
  recipients: Participant[];
  me: User;
  selectedConversationId?: string;
  conversation?: Conversation;
}): {
  messageData: MessageCreateRequest;
  conversationData: ConversationCreateRequest;
} {
  const isGroup = recipients.length > 1;

  const sender = conversation?.participants.find(
    (participant: Participant) => participant.participant_id === me.id
  );

  const recipient = conversation?.participants.find(
    (participant: Participant) => participant.participant_id !== me.id
  );

  const messageData: MessageCreateRequest = {
    conversation: selectedConversationId ?? "",
    attachments: [],
    content: message,
    type: MessageType.TEXT,
    sender_id: me.id,
    sender_type: ParticipantType.STAFF,
    external_receive_id: sender?.external_user_id,
    external_sender_id: recipient?.external_user_id,
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
