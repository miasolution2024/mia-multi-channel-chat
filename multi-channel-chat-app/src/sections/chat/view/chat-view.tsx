/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

import { EmptyContent } from "@/components/empty-content";

import { Layout } from "../layout";
import { ChatNav } from "../chat-nav";
import { ChatRoom } from "../chat-room";
import { ChatMessageList } from "../chat-message-list";
import { ChatMessageInput } from "../chat-message-input";
import { ChatHeaderDetail } from "../chat-header-detail";
import { useCollapseNav } from "../hooks/use-collapse-nav";
import { useRouter, useSearchParams } from "next/navigation";
import { paths } from "@/routes/path";
import { CONFIG } from "@/config-global";
import { useGetConversation } from "@/actions/conversation";
import { ConversationChannel } from "@/models/conversation/conversations";

// ----------------------------------------------------------------------

export function ChatView({
  channel = ConversationChannel.WEBSITE,
}: {
  channel?: ConversationChannel;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const selectedConversationId = parseInt(searchParams.get("id") || "0");

  const { conversation, conversationError, conversationLoading } =
    useGetConversation(selectedConversationId);

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  // const participants = conversation
  //   ? conversation.participants.filter(
  //       (participant) => participant.participant_id !== `${user?.id}`
  //     )
  //   : [];

  const allParticipants = conversation ? conversation.participants : [];

  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.dashboard.chat);
    }
  }, [conversationError, router, selectedConversationId]);


  return (
    <Layout
      sx={{
        minHeight: 0,
        flex: "1 1 0",
        borderRadius: 0,
        position: "relative",
      }}
      slots={{
        header: selectedConversationId ? (
          <ChatHeaderDetail
            collapseNav={roomNav}
            participants={allParticipants}
            loading={conversationLoading}
            is_chatbot_active={conversation?.is_chatbot_active ?? false}
            selectedConversationId={selectedConversationId}
          />
        ) : (
          <></>
        ),
        nav: (
          <ChatNav
            selectedConversationId={selectedConversationId}
            collapseNav={conversationsNav}
            channel={channel}
          />
        ),
        main: (
          <>
            {selectedConversationId ? (
              <ChatMessageList
                messages={conversation?.messages ?? []}
                participants={allParticipants}
                loading={conversationLoading}
                selectConversationId={selectedConversationId}
              />
            ) : (
              <EmptyContent
                imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                title="Good morning!"
                description="Write something awesome..."
              />
            )}

            <ChatMessageInput
              selectedConversationId={selectedConversationId}
              disabled={!selectedConversationId}
              selectedChannel={channel}
              conversation={conversation}
            />
          </>
        ),
        details: selectedConversationId && (
          <ChatRoom
            collapseNav={roomNav}
            participants={allParticipants}
            loading={conversationLoading}
            omni_channel_name={conversation?.omni_channel?.page_name}
            messages={conversation?.messages ?? []}
          />
        ),
      }}
    />
  );
}
