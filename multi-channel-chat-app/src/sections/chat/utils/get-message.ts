import { Message, MessageType } from "@/models/message/message";
import { Participant } from "@/models/participants/participant";

export function getMessage({
  message,
  participants,
  currentUserId,
}: {
  message: Message;
  participants: Participant[];
  currentUserId: string;
}) {
  const sender = participants.find(
    (participant: Participant) =>
      participant.participant_id == message.sender_id
  );


  const senderDetails =
    message.sender_id === currentUserId
      ? { type: "me" }
      : {
          firstName: sender?.participant_name,
          participant_type: sender?.participant_type,
          participant_avatar: sender?.participant_avatar,
        };

  const me = senderDetails.type === "me";

  const hasImage = message.type === MessageType.IMAGE;

  return { hasImage, me, senderDetails };
}
