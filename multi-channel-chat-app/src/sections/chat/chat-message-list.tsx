import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

import { Scrollbar } from "@/components/scrollbar";
import { Lightbox, useLightBox } from "@/components/lightbox";

import { ChatMessageItem } from "./chat-message-item";
import { useMessagesScroll } from "./hooks/use-messages-scroll";
import { Message, MessageType } from "@/models/message/message";
import { Participant } from "@/models/participants/participant";
import { useEffect } from "react";
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
  useEffect(() => {
    if (!user?.accessToken || !selectConversationId) return;

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
            },
          },
        })
      );
    };

    const handleOpen = () => {
      sendAuth();
      sendSubscribeMessages();
    };

    const handleMessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data) as websocketMessage;
      if (data.event === "create") {
        mutate(getConversationDetailURL(selectConversationId));
      }
      if (data.type === "ping") {
        connection.send(JSON.stringify({ type: "pong" }));
      }
    };

    connection.addEventListener("open", () => {
      console.log(`Subscribe to conversation ${selectConversationId}`);
      handleOpen();
    });

    connection.addEventListener("message", handleMessage);
    connection.addEventListener("close", function () {
      console.log({ event: "onclose" });
    });
    connection.addEventListener("error", function (error) {
      console.log({ event: "onerror", error });
    });
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
