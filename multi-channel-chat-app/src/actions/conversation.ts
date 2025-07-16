import { useMemo } from "react";
import useSWR from "swr";

import axios, { fetcher, endpoints } from "@/utils/axios";
import {
  Conversation,
  ConversationCreateRequest,
} from "@/models/conversation/conversations";

// ----------------------------------------------------------------------

export function getConversationsURL() {
  const queryParams = new URLSearchParams({
    "filter[participants][_some][participant_id][_eq]": "$CURRENT_USER",
    sort: "-last_message_at",
    fields: [
      "*",
      "participants.participant_id",
      "participants.participant_name",
      "messages.id",
      "messages.sender_id",
      "messages.type",
      "messages.content",
      "messages.date_created",
    ].join(","),
  }).toString();

  return `${endpoints.conversations.list}?${queryParams}`;
}

export function useGetConversations() {
  const url = getConversationsURL();

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);
  const memoizedValue = useMemo(() => {

    return {
      conversations: (data?.data as Conversation[]) || [],
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !data?.data.length,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return memoizedValue;
}
// ----------------------------------------------------------------------

export function getConversationDetailURL(conversationId: string) {
  return conversationId
    ? `${endpoints.conversations.list}/${conversationId}?fields=*,participants.*,messages.*`
    : "";
}

export function useGetConversation(conversationId: string) {
  const url = getConversationDetailURL(conversationId);

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      conversation: data?.data as Conversation,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createConversationAsync(
  request: ConversationCreateRequest
) {
  try {
    const response = await axios.post(endpoints.conversations.create, request);
    if ((response.status = 200)) {
      return response.data;
    }
  } catch (error) {
    console.error("Error during create product:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateConversationLastMessageDataAsync(
  conversationId: string,
  message: string
) {
  try {
    const url = `${endpoints.conversations.update}/${conversationId}`;
    const response = await axios.patch(url, {
      last_message_at: new Date(),
      last_message_summary: message,
    });
    if ((response.status = 200)) {
      return response.data;
    }
  } catch (error) {
    console.error("Error during update conversation:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateConversationChatbotActiveAsync(
  conversationId: string,
  isChatbotActive: boolean
) {
  try {
    const url = `${endpoints.conversations.update}/${conversationId}`;
    const response = await axios.patch(url, {
      is_chatbot_active: isChatbotActive,
    });
    if ((response.status = 200)) {
      return response.data;
    }
  } catch (error) {
    console.error("Error during update conversation:", error);
    throw error;
  }
}