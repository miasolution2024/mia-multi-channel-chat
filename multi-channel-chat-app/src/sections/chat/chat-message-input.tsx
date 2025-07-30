/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo, useState, useCallback } from "react";

import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";

import { Iconify } from "@/components/iconify";

import { initialConversation } from "./utils/initial-conversation";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { User } from "@/models/auth/user";
import { mutate } from "swr";
import { paths } from "@/routes/path";
import {
  createConversationAsync,
  getConversationsURL,
} from "@/actions/conversation";
import { sendMessage } from "@/actions/message";
import {
  Conversation,
  ConversationChannel,
} from "@/models/conversation/conversations";
import { Participant } from "@/models/participants/participant";

// ----------------------------------------------------------------------

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  selectedConversationId,
  selectedChannel,
  conversation,
}: {
  disabled: boolean;
  recipients: Participant[];
  onAddRecipients: (recipients: Participant[]) => void;
  selectedConversationId?: string;
  selectedChannel: ConversationChannel;
  conversation?: Conversation;
}) {
  const router = useRouter();

  const { user } = useAuthContext();

  const fileRef = useRef<any | null>(null);

  const [message, setMessage] = useState("");

  const myContact: User = useMemo(
    () => ({
      id: `${user?.id}`,
      role: user?.role,
      email: `${user?.email}`,
      full_name: `${user?.full_name}`,
      avatar: `${user?.avatar}`,
    }),
    [user]
  );

  const { messageData, conversationData } = initialConversation({
    message,
    recipients,
    me: myContact,
    selectedConversationId,
    conversation,
    selectedChannel,
  });

  // const handleAttach = useCallback(() => {
  //   if (fileRef.current) {
  //     fileRef.current.click();
  //   }
  // }, []);

  const handleChangeMessage = useCallback((event: any) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(async () => {
    try {
      if (!message) return;

      if (selectedConversationId) {
        await sendMessage(messageData);
        // mutate(getConversationDetailURL(selectedConversationId));
      } else {
        // If the conversation does not exist
        const res = await createConversationAsync(conversationData);
        mutate(getConversationsURL(selectedChannel, user?.id));
        router.push(`${paths.dashboard.chat}?id=${res.data.id}`);
        onAddRecipients([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMessage("");
    }
  }, [
    conversationData,
    message,
    messageData,
    onAddRecipients,
    router,
    selectedConversationId,
    selectedChannel,
    user?.id,
  ]);

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={(event) => {
          if (event.key !== "Enter") return;
          handleSendMessage();
        }}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        disabled={disabled}
        // startAdornment={
        //   <IconButton>
        //     <Iconify icon="eva:smiling-face-fill" />
        //   </IconButton>
        // }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            {/* <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton> */}
            <IconButton onClick={handleSendMessage}>
              <Iconify icon="streamline-plump:mail-send-email-message-solid" />
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

      <input type="file" ref={fileRef} style={{ display: "none" }} />
    </>
  );
}
