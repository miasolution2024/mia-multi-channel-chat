/* eslint-disable @typescript-eslint/no-explicit-any */
export function getMessage({ message, participants, currentUserId }: any) {
  const sender = participants.find((participant: any) => participant.id === message.senderId);

  const senderDetails =
    message.senderId === currentUserId
      ? { type: 'me' }
      : { avatarUrl: sender?.avatarUrl, firstName: sender?.name.split(' ')[0] };

  const me = senderDetails.type === 'me';

  const hasImage = message.contentType === 'image';

  return { hasImage, me, senderDetails };
}
