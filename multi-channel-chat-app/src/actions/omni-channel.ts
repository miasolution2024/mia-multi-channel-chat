// ----------------------------------------------------------------------

import { CONFIG } from "@/config-global";
import { ConversationChannel } from "@/models/conversation/conversations";
import { OmniChannel } from "@/models/omni-channel/omni-channel";
import axiosInstance, { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function getOmniChannelsURL() {
  return `${endpoints.omniChannels.list}`;
}

export function useGetOmniChannels() {
  const url = getOmniChannelsURL();

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );
  const memoizedValue = useMemo(() => {
    return {
      omniChannels: (data?.data as OmniChannel[]) || [],
      omniChannelsLoading: isLoading,
      omniChannelsError: error,
      omniChannelsValidating: isValidating,
      omniChannelsEmpty: !isLoading && !data?.data.length,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function getOmniChannelsByChannelURL(
  channel: ConversationChannel,
  userId?: string
) {
  if (!channel || !userId) return "";
  const queryParams = new URLSearchParams({
    "filter[source][_eq]": channel,
    "filter[user_groups][_some][user_groups_id][users][directus_users_id][_eq]":
      userId,
    "filter[is_enabled][_eq]": "true",
    fields: ["id", "page_id", "page_name"].join(","),
    sort: "sort",
  }).toString();
  return `${endpoints.omniChannels.list}?${queryParams}`;
}

export function useGetOmniChannelsByChannel(
  channel: ConversationChannel,
  userId?: string
) {
  const url = getOmniChannelsByChannelURL(channel, userId);

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );
  const memoizedValue = useMemo(() => {
    return {
      omniChannels: (data?.data as OmniChannel[]) || [],
      omniChannelsLoading: isLoading,
      omniChannelsError: error,
      omniChannelsValidating: isValidating,
      omniChannelsEmpty: !isLoading && !data?.data.length,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return memoizedValue;
}

export async function getZaloQRLoginImage() {
  try {
    const url = `${CONFIG.utilitiesAPIUr}/qr-login`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error during create message:", error);
    throw error;
  }
}
