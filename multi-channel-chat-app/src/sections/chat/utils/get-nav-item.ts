import { Conversation } from "@/models/conversation/conversations";
import { MessageType } from "@/models/message/message";

export function getNavItem({
  currentUserId,
  conversation,
}: {
  currentUserId: string;
  conversation: Conversation;
}) {
  const { messages, participants } = conversation;

  const participantsInConversation = participants.filter(
    (participant) => participant.participant_id !== currentUserId
  );

  const displayName = participantsInConversation
    .map((participant) => participant.participant_name)
    .join(", ");

  const lastMessage = messages[messages.length - 1];

  let displayText = "";

  if (lastMessage) {
    const sender = lastMessage.sender_id === currentUserId ? "You: " : "";

    const message =
      lastMessage.type === MessageType.IMAGE
        ? "Sent a photo"
        : lastMessage.content;

    displayText = `${sender}${message}`;
  }

  return {
    displayName: displayName,
    displayText,
    participants: participantsInConversation,
    lastActivity: lastMessage?.date_created,
  };
}
