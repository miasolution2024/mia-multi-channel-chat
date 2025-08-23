// ----------------------------------------------------------------------

import { ConversationChannel } from "@/models/conversation/conversations";
import { OmniChannel } from "@/models/omni-channel/omni-channel";
import { endpoints, fetcher, swrConfig } from "@/utils/axios";
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

export function getOmniChannelsByChannelURL(channel: ConversationChannel) {
  if (!channel) return "";
  const queryParams = new URLSearchParams({
    "filter[source][_eq]": channel,
    "filter[is_enabled][_eq]": "true",
    fields: ["id", "page_id", "page_name"].join(","),
  }).toString();
  return `${endpoints.omniChannels.list}?${queryParams}`;
}

export function useGetOmniChannelsByChannel(channel: ConversationChannel) {
  const url = getOmniChannelsByChannelURL(channel);

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
