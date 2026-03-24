import { useMemo } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

import axios, { fetcher, endpoints, swrConfig } from "@/utils/axios";
import {
  Conversation,
  ConversationCreateRequest,
} from "@/models/conversation/conversations";

const PAGE_SIZE = 20;

// ----------------------------------------------------------------------

export function getConversationsURL(userId?: string) {
  if (!userId) return "";
  const queryParams = new URLSearchParams({
    "filter[participants][_some][participant_id][_eq]": userId,
    "filter[messages][id][_nnull]": "true",
    sort: "-messages.date_created",
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

export function useGetConversations(userId?: string) {
  const url = getConversationsURL(userId);

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );
  const memoizedValue = useMemo(() => {
    return {
      conversations: ((data?.data as Conversation[]) || []).filter((conv) => conv.messages?.length > 0),
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !data?.data.length,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function getConversationsPageURL(userId?: string, offset = 0) {
  if (!userId) return null;
  const queryParams = new URLSearchParams({
    "filter[participants][_some][participant_id][_eq]": userId,
    "filter[messages][id][_nnull]": "true",
    sort: "-messages.date_created",
    limit: PAGE_SIZE.toString(),
    offset: offset.toString(),
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

export function useGetConversationsPaginated(userId?: string) {
  const getKey = (pageIndex: number, previousPageData: { data: Conversation[] } | null) => {
    if (!userId) return null;
    if (previousPageData && previousPageData.data?.length < PAGE_SIZE) return null;
    return getConversationsPageURL(userId, pageIndex * PAGE_SIZE);
  };

  const { data, isLoading, size, setSize, mutate } = useSWRInfinite(
    getKey,
    fetcher,
    { ...swrConfig, revalidateFirstPage: false }
  );

  const conversations = useMemo(
    () =>
      (data?.flatMap((page) => (page?.data as Conversation[]) ?? []) ?? []).filter(
        (conv) => conv.messages?.length > 0
      ),
    [data]
  );

  const lastPage = data?.[data.length - 1];
  const hasMore = lastPage ? lastPage.data?.length === PAGE_SIZE : false;
  const isLoadingMore = isLoading || (size > 0 && !!data && typeof data[size - 1] === "undefined");

  return {
    conversations,
    conversationsLoading: isLoading && !data,
    isLoadingMore: !!isLoadingMore,
    hasMore,
    loadMore: () => setSize((s) => s + 1),
    mutateConversations: mutate,
  };
}
// ----------------------------------------------------------------------

export function getConversationDetailURL(conversationId: string) {
  return conversationId
    ? `${endpoints.conversations.list}/${conversationId}?fields=*,participants.*,messages.*`
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
