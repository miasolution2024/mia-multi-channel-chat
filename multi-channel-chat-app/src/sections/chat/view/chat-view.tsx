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
import { DashboardContent } from "@/layouts/dashboard";

// ----------------------------------------------------------------------

export function ChatView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const selectedConversationId = id ? parseInt(id) : 0;

  const { conversation, conversationError, conversationLoading } =
    useGetConversation(selectedConversationId);

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const allParticipants = conversation ? conversation.participants : [];

  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.dashboard.chat);
    }
  }, [conversationError, router, selectedConversationId]);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
      }}
    >
      <Layout
        sx={{

          minHeight: 0,
          flex: "1 1 0",
          borderRadius: 2,
          position: "relative",
          bgcolor: "background.paper",
          boxShadow: (theme: any) => theme.customShadows.card,
        }}
        slots={{
          header: selectedConversationId ? (
            <ChatHeaderDetail
              collapseNav={roomNav}
              participants={allParticipants}
              loading={conversationLoading}
            />
          ) : (
            <></>
          ),
          nav: (
            <ChatNav
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
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
                conversation={conversation}
              />
            </>
          ),
          details: selectedConversationId !== 0 && (
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
    </DashboardContent>
  );
}
