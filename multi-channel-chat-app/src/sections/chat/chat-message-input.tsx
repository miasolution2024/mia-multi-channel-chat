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
import { useBoolean } from "@/hooks/use-boolean";
import { MultiFilePreview } from "@/components/upload";
import { uploadFile } from "@/actions/upload";
import { fileTypeByUrl, getMessageType } from "@/components/file-thumbnail";
import { useSearchParams } from "next/navigation";

// ----------------------------------------------------------------------

export function ChatMessageInput({
  disabled,
  selectedConversationId,
  conversation,
}: {
  disabled: boolean;
  selectedConversationId?: number;
  conversation?: Conversation;
}) {
  const { user } = useAuthContext();

  const fileRef = useRef<any | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const isSending = useBoolean();

  const searchParams = useSearchParams();

  const selectedChannel = (searchParams.get("channel") || ConversationChannel.FACEBOOK) as ConversationChannel;

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

  const handleFileChange = (event: any) => {
    console.log(event);

    setFile(event.target.files[0]);
  };

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event: any) => {
    setMessage(event.target.value);
  }, []);

  const onRemove = () => {
    setFile(null);
  };

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        const response = await uploadFile(file);
        messageData.attachments = [
          { id: response.data.id, fileExtension: fileTypeByUrl(file.name), fileName: file.name },
        ];
        messageData.type = getMessageType(file.name);
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setFile(null);
      }
    },
    [messageData]
  );

  const handleSendMessage = useCallback(async () => {
    try {
      if (!selectedConversationId || isSending.value) return;

      if (!message && !file) return;

      isSending.onTrue();

      if (file) {
        await handleUpload(file);
      }

      await sendMessage(messageData);
    } catch (error) {
      console.error(error);
    } finally {
      isSending.onFalse();
      setMessage("");
    }
  }, [
    message,
    messageData,
    selectedConversationId,
    isSending,
    file,
    handleUpload,
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
        disabled={disabled || isSending.value}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
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
      {file && (
        <MultiFilePreview files={[file]} onRemove={onRemove} sx={{ m: 3 }} />
      )}

      <input
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
