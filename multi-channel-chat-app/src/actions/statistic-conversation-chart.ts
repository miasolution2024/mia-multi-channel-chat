import { OmniChannel } from "@/models/omni-channel/omni-channel";
import { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

export type ConversationsCount = {
  omni_channel: number;
  count: string;
};

export function useGetConversationsCount() {
  const conversationsApi = `${endpoints.conversations.list}?aggregate[count]=*&groupBy=omni_channel`;

  const channelsApi = `${endpoints.omniChannels.list}?fields=id,page_name`;

  try {
    const {
      data: conversationsData,
      isLoading: conversationsLoading,
      error: conversationsError,
      isValidating: conversationsValidate,
    } = useSWR(conversationsApi, fetcher, swrConfig);

    const {
      data: channelsData,
      isLoading: channelsLoading,
      error: channelsError,
      isValidating: channelsValidate,
    } = useSWR(channelsApi, fetcher, swrConfig);

    const memoizedValue = useMemo(() => {
      const isLoading = conversationsLoading || channelsLoading;
      const error = conversationsError || channelsError;
      const isValidating = conversationsValidate || channelsValidate;

      let mergedData: (ConversationsCount & { channel_name?: string })[] = [];

      if (conversationsData?.data && channelsData?.data) {
        const channelMap = new Map<number, string>();

        channelsData.data.forEach((channel: OmniChannel) => {
          channelMap.set(channel.id, channel.page_name);
        });

        mergedData = conversationsData.data.map((item: ConversationsCount) => ({
          ...item,
          channel_name:
            channelMap.get(item.omni_channel) || `Channel ${item.omni_channel}`,
        }));
      }
      return {
        conversationsCount: mergedData,
        conversationsCountLoading: isLoading,
        conversationsCountError: error,
        conversationsCountValidate: isValidating,
      };
    }, [
      conversationsData?.data,
      conversationsLoading,
      conversationsError,
      conversationsValidate,
      channelsData?.data,
      channelsLoading,
      channelsError,
      channelsValidate,
    ]);
    return memoizedValue;
  } catch (error) {
    console.error("Error during get conversations count:", error);
    throw error;
  }
}

export function transformConversationsData(
  data: (ConversationsCount & { channel_name?: string })[] | undefined
): { total: number; series: { label: string; data: number }[] } {
  if (!data || !Array.isArray(data)) return { total: 0, series: [] };

  const sanitized = data.filter((item) => {
    if (!item) return false;
    const countValid =
      item.count !== null &&
      item.count !== undefined &&
      item.count !== "" &&
      item.count !== "null";

    const conversationsValid =
      item.omni_channel !== null && item.omni_channel !== undefined;

    return countValid && conversationsValid;
  });

  const sortedData = sanitized.sort((a, b) => a.omni_channel - b.omni_channel);

  const series = sortedData.map((item) => ({
    label: item.channel_name || `Channel ${item.omni_channel}`,
    data: parseInt(item.count, 10) || 0,
  }));

  const total = series.reduce((sum, item) => sum + item.data, 0);

  return { series, total };
}
