/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";

import { EmptyContent } from "@/components/empty-content";

import { Layout } from "../layout";
import { ChatNav } from "../chat-nav";
import { ChatRoom } from "../chat-room";
import { ChatMessageList } from "../chat-message-list";
import { ChatMessageInput } from "../chat-message-input";
import { ChatHeaderDetail } from "../chat-header-detail";
import { ChatHeaderCompose } from "../chat-header-compose";
import { useCollapseNav } from "../hooks/use-collapse-nav";
import { useRouter, useSearchParams } from "next/navigation";
import { paths } from "@/routes/path";
import { CONFIG } from "@/config-global";
import { useGetCustomers } from "@/actions/customer";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import {
  Participant,
  ParticipantType,
} from "@/models/participants/participant";
import { useGetUsers } from "@/actions/user";
import {
  useGetConversation,
  useGetConversations,
} from "@/actions/conversation";
import { ConversationChannel } from "@/models/conversation/conversations";

// ----------------------------------------------------------------------

export function ChatView({
  channel = ConversationChannel.WEBSITE,
}: {
  channel?: ConversationChannel;
}) {
  const router = useRouter();

  const { user } = useAuthContext();

  const { customers } = useGetCustomers();

  const { users } = useGetUsers();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get("id") || "";

  const [contacts, setContacts] = useState<Participant[]>([]);

  const [recipients, setRecipients] = useState<Participant[]>([]);

  const { conversations, conversationsLoading } = useGetConversations(
    channel,
    user?.id
  );

  const { conversation, conversationError, conversationLoading } =
    useGetConversation(`${selectedConversationId}`);



  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const participants = conversation
    ? conversation.participants.filter(
        (participant) => participant.participant_id !== `${user?.id}`
      )
    : [];

  useEffect(() => {
    if (customers.length > 0 || users.length > 0) {
      const customerContacts = customers.map((c) => ({
        id: c.id,
        participant_id: c.id,
        participant_name: c.name,
        participant_email: c.email,
        participant_phone: c.phone_number,
        participant_type: ParticipantType.CUSTOMER,
      }));

      const userContacts = users
        .filter((u) => u.id !== user?.id)
        .map((u) => ({
          id: u.id,
          participant_id: u.id,
          participant_name: `${u.first_name} ${u.last_name}`,
          participant_email: u.email,
          participant_phone: "",
          participant_type: ParticipantType.STAFF,
        }));

      setContacts([...customerContacts, ...userContacts]);
    }
  }, [customers, users, user?.id]);

  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.dashboard.chat);
    }
  }, [conversationError, router, selectedConversationId]);

  const handleAddRecipients = useCallback((selected: Participant[]) => {
    setRecipients(selected);
  }, []);

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
            participants={participants}
            loading={conversationLoading}
            is_chatbot_active={conversation?.is_chatbot_active ?? false}
            selectedConversationId={selectedConversationId}
          />
        ) : (
          <ChatHeaderCompose
            contacts={contacts}
            onAddRecipients={handleAddRecipients}
          />
        ),
        nav: (
          <ChatNav
            contacts={contacts}
            conversations={conversations}
            loading={conversationsLoading}
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
                participants={participants}
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
              recipients={recipients}
              onAddRecipients={handleAddRecipients}
              selectedConversationId={selectedConversationId}
              disabled={!recipients.length && !selectedConversationId}
              selectedChannel={channel}
              conversation={conversation}
            />
          </>
        ),
        details: selectedConversationId && (
          <ChatRoom
            collapseNav={roomNav}
            participants={participants}
            loading={conversationLoading}
            omni_channel_name={conversation?.omni_channel?.page_name}
            messages={conversation?.messages ?? []}
          />
        ),
      }}
    />
  );
}
