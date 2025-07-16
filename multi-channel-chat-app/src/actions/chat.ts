/* eslint-disable @typescript-eslint/no-explicit-any */
import  { mutate } from "swr";

import axios, { endpoints } from "@/utils/axios";
import {
  ConversationCreateRequest,
} from "@/models/conversation/conversations";

// ----------------------------------------------------------------------

const enableServer = false;

const CHART_ENDPOINT = endpoints.chat;

// ----------------------------------------------------------------------

export async function createConversation(
  conversationData: ConversationCreateRequest
) {
  const url = [CHART_ENDPOINT, { params: { endpoint: "conversations" } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(CHART_ENDPOINT, data);

  /**
   * Work in local
   */
  mutate(
    url,
    (currentData: any) => {
      const currentConversations = currentData.conversations;

      const conversations = [...currentConversations, conversationData];

      return { ...currentData, conversations };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.get(CHART_ENDPOINT, {
      params: { conversationId, endpoint: "mark-as-seen" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    [CHART_ENDPOINT, { params: { endpoint: "conversations" } }],
    (currentData) => {
      const currentConversations = currentData.conversations;

      const conversations = currentConversations.map((conversation: any) =>
        conversation.id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}
