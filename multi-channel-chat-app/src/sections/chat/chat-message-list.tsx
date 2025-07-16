import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

import { Scrollbar } from "@/components/scrollbar";
import { Lightbox, useLightBox } from "@/components/lightbox";

import { ChatMessageItem } from "./chat-message-item";
import { useMessagesScroll } from "./hooks/use-messages-scroll";
import { Message, MessageType } from "@/models/message/message";
import { Participant } from "@/models/participants/participant";
import { useEffect, useRef } from "react";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { getConversationDetailURL } from "@/actions/conversation";
import { mutate } from "swr";
import { websocketMessage } from "@/models/websocket-message";
import { CONFIG } from "@/config-global";

// ----------------------------------------------------------------------

export function ChatMessageList({
  messages = [],
  participants,
  loading,
  selectConversationId,
}: {
  messages: Message[];
  participants: Participant[];
  loading: boolean;
  selectConversationId: string;
}) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const slides = messages
    .filter((message: Message) => message.type === MessageType.IMAGE)
    .map((message: Message) => ({ src: message.content }));

  const lightbox = useLightBox(slides);

  const { user } = useAuthContext();
  const websocketRef = useRef<WebSocket | null>(null);

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
          action: "read",
          collection: "mc_messages",
          query: {
            fields: ["id,conversation"],
            filter: {
              conversation: {
                _eq: selectConversationId,
              },
              sender_id:{
                _neq: "$CURRENT_USER"
              }
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
      sendSubscribeMessages();
    };

    const handleMessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data) as websocketMessage;
      if (data.event === "create") {
        console.log(
          "New message received, potentially refetching conversation details."
        );
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
  }, [user?.accessToken, selectConversationId]);

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
            participants={participants}
            onOpenLightbox={() => lightbox.onOpen(message.content)}
          />
        ))}
      </Scrollbar>

      <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      />
    </>
  );
}
