import { Conversation } from "@/models/conversation/conversations";
import { MessageType } from "@/models/message/message";
import { ParticipantType } from "@/models/participants/participant";

export function getNavItem({
  currentUserId,
  conversation,
}: {
  currentUserId: string;
  conversation: Conversation;
}) {
  const { messages, participants } = conversation;

  const participantsInConversation = participants.filter(
    (participant) =>
      participant.participant_id !== currentUserId &&
      participant.participant_type !== ParticipantType.CHATBOT
  );

  const displayName = participantsInConversation
    .map((participant) => participant.participant_name)
    .join(", ");

  const lastMessage = messages[messages.length - 1];

  let displayText = "";

  if (lastMessage) {
    const sender =
      lastMessage.sender_id === currentUserId || lastMessage.sender_type === ParticipantType.CHATBOT
        ? "You: "
        : "";

    const message =
      lastMessage.type === MessageType.IMAGE
        ? "Sent a photo"
        : lastMessage.type === MessageType.TEXT
        ? lastMessage.content
        : "Sent an attachment";

    displayText = `${sender}${message}`;
  }

  return {
    displayName: displayName,
    displayText,
    participants: participantsInConversation,
    lastActivity: lastMessage?.date_created,
  };
}
