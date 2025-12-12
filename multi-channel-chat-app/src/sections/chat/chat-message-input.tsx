/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useMemo, useState, useCallback } from "react";

import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";

import { Iconify } from "@/components/iconify";

import { initialConversation } from "./utils/initial-conversation";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { User } from "@/models/auth/user";
import { sendMessage } from "@/actions/message";
import {
  Conversation,
  ConversationChannel,
} from "@/models/conversation/conversations";

// ----------------------------------------------------------------------

export function ChatMessageInput({
  disabled,
  selectedConversationId,
  selectedChannel,
  conversation,
}: {
  disabled: boolean;
  selectedConversationId?: number;
  selectedChannel: ConversationChannel;
  conversation?: Conversation;
}) {
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

  const { messageData } = initialConversation({
    message,
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

      if (!selectedConversationId) return;
      await sendMessage(messageData);
    } catch (error) {
      console.error(error);
    } finally {
      setMessage("");
    }
  }, [message, messageData, selectedConversationId]);

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
