/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import useSWR from "swr";

import axios, { fetcher, endpoints, swrConfig } from "@/utils/axios";
import {
  Conversation,
  ConversationChannel,
  ConversationCreateRequest,
  ConversationSumUnreadCountByChannel,
} from "@/models/conversation/conversations";

// ----------------------------------------------------------------------

export function getConversationsURL(
  channel: ConversationChannel,
  pageId: string,
  participantIds: string[]
) {
  if (!participantIds || !pageId) return "";
  const queryParams = new URLSearchParams({
    "filter[participants][_some][participant_id][_in]":
      participantIds.join(","),
    "filter[omni_channel][page_id][_eq]": pageId,
    "filter[channel][_eq]": channel,
    sort: "-last_message_at",
    fields: [
      "*",
      "participants.participant_id",
      "participants.participant_name",
      "participants.participant_avatar",
      "participants.participant_type",
      "messages.id",
      "messages.sender_id",
      "messages.sender_type",
      "messages.type",
      "messages.content",
      "messages.date_created",
      "omni_channel.id",
      "omni_channel.page_id",
      "omni_channel.page_name",
    ].join(","),
  }).toString();

  return `${endpoints.conversations.list}?${queryParams}`;
}

export function useGetConversations(
  channel: ConversationChannel,
  pageId: string,
  participantIds: string[]
) {
  const url = getConversationsURL(channel, pageId, participantIds);

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

export function getConversationDetailURL(conversationId: number) {
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
      "messages.attachments.directus_files_id.filesize",
      "messages.attachments.directus_files_id.filename_download",
      "omni_channel.id",
      "omni_channel.page_name",
      "omni_channel.page_id",
    ].join(","),
  }).toString();

  return conversationId
    ? `${endpoints.conversations.list}/${conversationId}?${queryParams}`
    : "";
}

export function useGetConversation(conversationId: number) {
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
  conversationId: number,
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

// ----------------------------------------------------------------------

export async function readConversationAsync(conversationId: number) {
  try {
    const url = `${endpoints.conversations.update}/${conversationId}`;
    const response = await axios.patch(url, {
      unread_count: 0,
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

export async function getConversationByParticipantId(participantId: number) {
  try {
    const url = `${endpoints.conversations.list}?filter[participants][_some][participant_id][_eq]=${participantId}`;
    const response = await axios.get(url);
    if (response.status === 200 && response.data) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Error during get conversation:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------
export function getConversationsUnreadCountURL(participantIds: string[]) {
  if (!participantIds) return "";
  const queryParams = new URLSearchParams({
    "filter[participants][_some][participant_id][_in]":
      participantIds.join(","),
    "filter[unread_count][_gt]": "0",
    "aggregate[count]": "unread_count",
    "groupBy[]": "channel",
  }).toString();
  return `${endpoints.conversations.list}?${queryParams}`;
}

export function useGetUnreadCountGroupByChannel(participantIds: string[]) {
  try {
    const { data, isLoading, error, isValidating } = useSWR(
      getConversationsUnreadCountURL(participantIds),
      fetcher,
      swrConfig
    );

    const memoizedValue = useMemo(
      () => ({
        conversationUnRead: data?.data as ConversationSumUnreadCountByChannel[],
        conversationUnReadLoading: isLoading,
        conversationUnReadError: error,
        conversationUnReadValidating: isValidating,
      }),
      [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
  } catch (error) {
    console.error("Error during get conversation unread:", error);
    throw error;
  }
}
