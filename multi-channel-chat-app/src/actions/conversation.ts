import { useMemo } from "react";
import useSWR from "swr";

import axios, { fetcher, endpoints, swrConfig } from "@/utils/axios";
import {
  Conversation,
  ConversationChannel,
  ConversationCreateRequest,
} from "@/models/conversation/conversations";

// ----------------------------------------------------------------------

export function getConversationsURL(
  channel: ConversationChannel,
  userId?: string
) {
  if (!userId) return "";
  const queryParams = new URLSearchParams({
    "filter[participants][_some][participant_id][_eq]": userId,
    "filter[channel][_eq]": channel,
    sort: "-last_message_at",
    fields: [
      "*",
      "participants.participant_id",
      "participants.participant_name",
      "participants.participant_avatar",
      "messages.id",
      "messages.sender_id",
      "messages.type",
      "messages.content",
      "messages.date_created",
    ].join(","),
  }).toString();

  return `${endpoints.conversations.list}?${queryParams}`;
}

export function useGetConversations(
  channel: ConversationChannel,
  userId?: string
) {
  const url = getConversationsURL(channel, userId);

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );

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
  const queryParams = new URLSearchParams({
    fields: [
      "*",
      "participants.*",
      "messages.*",
      "messages.attachments.*",
      "messages.attachments.directus_files_id.id",
      "messages.attachments.directus_files_id.type",
      "messages.attachments.directus_files_id.modified_on",
      "messages.attachments.directus_files_id.created_on",
      "messages.attachments.directus_files_id.filename_download",
      "omni_channel.id",
      "omni_channel.page_name",
    ].join(","),
  }).toString();

  return conversationId
    ? `${endpoints.conversations.list}/${conversationId}?${queryParams}`
    : "";
}

export function useGetConversation(conversationId: string) {
  const url = getConversationDetailURL(conversationId);

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );

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
