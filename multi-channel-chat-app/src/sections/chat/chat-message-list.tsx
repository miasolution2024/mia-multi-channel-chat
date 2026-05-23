import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "@/components/scrollbar";
import { Lightbox, useLightBox } from "@/components/lightbox";

import { ChatMessageItem } from "./chat-message-item";
import { useMessagesScroll } from "./hooks/use-messages-scroll";
import { Message, MessageType } from "@/models/message/message";
import {
  Participant,
  ParticipantType,
} from "@/models/participants/participant";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import {
  getConversationDetailURL,
  getConversationsUnreadCountURL,
} from "@/actions/conversation";
import { mutate } from "swr";
import { websocketMessage } from "@/models/websocket-message";
import { CONFIG } from "@/config-global";
import NotificationSound from "@/components/notification-sound/notification-sound";
import { uuidv4 } from "@/utils/uuidv4";
import { useGetUsersByGroupIds } from "@/actions/user";

// ----------------------------------------------------------------------

export function ChatMessageList({
  messages = [],
  participants,
  loading,
  selectConversationId,
  pendingMessageContent,
}: {
  messages: Message[];
  participants: Participant[];
  loading: boolean;
  selectConversationId: number;
  pendingMessageContent?: string;
}) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const slides = messages
    .filter((message: Message) => message.type === MessageType.IMAGE)
    .flatMap((message: Message) =>
      message.attachments.map((a) => ({
        src: `${CONFIG.serverUrl}/assets/${a.directus_files_id.id}`,
      }))
    );

  const lightbox = useLightBox(slides);

  const { user } = useAuthContext();

  const userGroupIds = participants
    .filter((p) => p.participant_type === ParticipantType.STAFF)
    .map((p) => p.participant_id);

  const { users } = useGetUsersByGroupIds(userGroupIds);

  const websocketRef = useRef<WebSocket | null>(null);

  const [playNotification, setPlayNotification] = useState<boolean>(false);

  useEffect(() => {
    if (playNotification) {
      const timer = setTimeout(() => {
        setPlayNotification(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [playNotification]);

  useEffect(() => {
    if (!user?.accessToken || !selectConversationId) {
      if (websocketRef.current) {
        console.log("Closing existing connection due to missing dependencies.");
        websocketRef.current.close();
        websocketRef.current = null;
      }
      return;
    }

    console.log(
      `Attempting to subscribe to conversation ${selectConversationId}`
    );

    // Close any existing connection before opening a new one
    if (websocketRef.current) {
      console.log(
        `Closing old connection for conversation ${selectConversationId}`
      );
      websocketRef.current.close();
      websocketRef.current = null; // Clear the ref
    }

    const connection = new WebSocket(CONFIG.websocketUrl);

    const sendAuth = () => {
      connection.send(
        JSON.stringify({
          type: "auth",
          access_token: user?.accessToken,
        })
      );
    };

    const sendSubscribeMessages = () => {
      connection.send(
        JSON.stringify({
          type: "subscribe",
          event: "create",
          collection: "mc_messages",
          uid: uuidv4(),
          query: {
            fields: ["id,conversation,sender_id"],
            filter: {
              conversation: {
                _eq: selectConversationId,
              },
              //   sender_id:{
              //     _neq: "$CURRENT_USER"
              //   }
            },
          },
        })
      );

      connection.send(
        JSON.stringify({
          type: "subscribe",
          event: "update",
          collection: "mc_messages",
          uid: uuidv4(),
          query: {
            fields: ["id,conversation,ai_reply_message_suggestion,translated_message"],
            filter: {
              conversation: {
                _eq: selectConversationId,
              },
            },
          },
        })
      );
    };

    const handleOpen = () => {
      websocketRef.current = connection;

      console.log(
        `WebSocket connection opened for conversation ${selectConversationId}`
      );
      sendAuth();
    };

    const handleMessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data) as websocketMessage;

      if (data.type == "auth" && data.status == "ok") {
        sendSubscribeMessages();
      }

      if (data.event === "create") {
        console.log(
          "New message received, potentially refetching conversation details."
        );

        if (data.data.length > 0 && data.data[0].sender_id !== user?.id)
          setPlayNotification(true);

        mutate(getConversationDetailURL(selectConversationId));
        mutate(getConversationsUnreadCountURL(user?.company_id?.id || "", user?.isAdmin));
      }

      if (data.event === "update") {
        console.log("Message updated (AI suggestion / translation), refetching.");
        mutate(getConversationDetailURL(selectConversationId));
      }
      if (data.type === "ping") {
        connection.send(JSON.stringify({ type: "pong" }));
      }
    };

    const handleClose = () => {
      console.log(
        `WebSocket connection closed for conversation ${selectConversationId}`
      );
      websocketRef.current = null; // Clear the ref when connection closes
    };

    const handleError = (error: Event) => {
      console.error({
        event: "onerror",
        error,
        message: `WebSocket error for conversation ${selectConversationId}`,
      });
      websocketRef.current = null; // Clear the ref on error
    };

    connection.addEventListener("open", handleOpen);
    connection.addEventListener("message", handleMessage);
    connection.addEventListener("close", handleClose);
    connection.addEventListener("error", handleError);

    return () => {
      if (websocketRef.current) {
        console.log(
          `Cleaning up: Closing WebSocket connection for conversation ${selectConversationId}`
        );
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [user?.accessToken, selectConversationId, user?.id]);

  if (loading) {
    return (
      <Stack sx={{ flex: "1 1 auto", position: "relative" }}>
        <LinearProgress
          color="inherit"
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 2,
            borderRadius: 0,
            position: "absolute",
          }}
        />
      </Stack>
    );
  }

  return (
    <>
      <Scrollbar
        ref={messagesEndRef}
        sx={{ px: 3, pt: 5, pb: 3, flex: "1 1 auto" }}
      >
        {messages.map((message: Message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            users={users}
            participants={participants}
            onOpenLightbox={() =>
              lightbox.onOpen(
                `${CONFIG.serverUrl}/assets/${message.attachments[0].directus_files_id.id}`
              )
            }
          />
        ))}

        {pendingMessageContent && (
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 5 }}>
            <Stack alignItems="flex-end">
              <Typography
                noWrap
                variant="caption"
                sx={{ mb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <CircularProgress size={10} thickness={5} />
                Đang gửi...
              </Typography>
              <Stack
                sx={{
                  p: 1.5,
                  minWidth: 48,
                  maxWidth: 350,
                  borderRadius: 1,
                  typography: 'body2',
                  bgcolor: 'primary.lighter',
                  color: 'grey.800',
                  opacity: 0.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {pendingMessageContent}
              </Stack>
            </Stack>
          </Stack>
        )}
      </Scrollbar>

      <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      />
      <NotificationSound play={playNotification} />
    </>
  );
}
