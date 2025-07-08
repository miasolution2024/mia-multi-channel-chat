/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';


import { Iconify } from '@/components/iconify';

import { initialConversation } from './utils/initial-conversation';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/auth/hooks/use-auth-context';
import { today } from '@/utils/format-time';

// ----------------------------------------------------------------------

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  selectedConversationId,
}: any) {
  const router = useRouter();

  const { user } = useAuthContext();

  const fileRef = useRef<any | null>(null);

  const [message, setMessage] = useState('');

  const myContact = useMemo(
    () => ({
      id: `${user?.userID}`,
      role: `${user?.role}`,
      // email: `${user?.email}`,
      // address: `${user?.address}`,
      name: `${user?.fullName}`,
      lastActivity: today(),
      avatarUrl: `${user?.photoURL}`,
      // phoneNumber: `${user?.phoneNumber}`,
      status: 'online',
    }),
    [user]
  );

  const { messageData, conversationData } = initialConversation({
    message,
    recipients,
    me: myContact,
  });

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event: any) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event: any) => {
      if (event.key !== 'Enter' || !message) return;

      try {
        // if (selectedConversationId) {
        //   // If the conversation already exists
        //   await sendMessage(selectedConversationId, messageData);
        // } else {
        //   // If the conversation does not exist
        //   const res = await createConversation(conversationData);
        //   router.push(`${paths.dashboard.chat}?id=${res.conversation.id}`);

        //   onAddRecipients([]);
        // }
      } catch (error) {
        console.error(error);
      } finally {
        setMessage('');
      }
    },
    [conversationData, message, messageData, onAddRecipients, router, selectedConversationId]
  );

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        disabled={disabled}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme: any) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
