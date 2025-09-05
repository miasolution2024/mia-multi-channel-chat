import { User } from "@/models/auth/user";
import { Message } from "@/models/message/message";
import {
  Participant,
  ParticipantType,
} from "@/models/participants/participant";

export function getMessage({
  message,
  participants,
  users,
}: {
  message: Message;
  participants: Participant[];
  users: User[];
}) {
  const sender = participants.find(
    (participant: Participant) =>
      participant.participant_id == message.sender_id
  );

  const userSender = users.find((user: User) => user.id == message.sender_id);

  const senderDetails = {
    firstName: "",
    participant_avatar: "",
  };

  switch (message.sender_type) {
    case ParticipantType.CUSTOMER:
    case ParticipantType.CHATBOT:
      senderDetails.firstName = sender?.participant_name || "";
      senderDetails.participant_avatar = sender?.participant_avatar || "";
      break;
    case ParticipantType.STAFF:
      senderDetails.firstName = userSender
        ? `${userSender.first_name} ${userSender?.last_name}`
        : "";
      break;
    default:
      break;
  }

  return {
    type: message.type,
    me: message.sender_type !== ParticipantType.CUSTOMER,
    senderDetails,
  };
}
