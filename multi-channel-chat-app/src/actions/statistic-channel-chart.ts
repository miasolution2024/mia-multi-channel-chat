import { OmniChannel } from "@/models/omni-channel/omni-channel";
import { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

export type ChannelsCount = {
  omni_channel: number;
  count: string;
};

export function useGetChannelsCount() {
  const appointmentsApi = `${endpoints.appointments.list}?aggregate[count]=*&groupBy=omni_channel`;

  const channelsApi = `${endpoints.omniChannels.list}?fields=id,page_name`; // fetch the data of the omni channels

  try {
    const {
      data: appointmentsData,
      isLoading: appointmentsLoading,
      error: appointmentsError,
      isValidating: appointmentsValidate,
    } = useSWR(appointmentsApi, fetcher, swrConfig);

    const {
      data: channelsData,
      isLoading: channelsLoading,
      error: channelsError,
      isValidating: channelsValidate,
    } = useSWR(channelsApi, fetcher, swrConfig);

    const memoizedValue = useMemo(() => {
      const isLoading = channelsLoading || appointmentsLoading;
      const error = channelsError || appointmentsError;
      const isValidating = channelsValidate || appointmentsValidate;

      let mergedData: (ChannelsCount & { channel_name?: string })[] = [];

      if (channelsData?.data && appointmentsData?.data) {
        const channelMap = new Map<number, string>();

        channelsData.data.forEach((channel: OmniChannel) => {
          channelMap.set(channel.id, channel.page_name);
        });

        mergedData = appointmentsData.data.map((item: ChannelsCount) => ({
          ...item,
          channel_name:
            channelMap.get(item.omni_channel) || `Channel ${item.omni_channel}`,
        }));
      }

      return {
        channelsCount: mergedData,
        channelsCountLoading: isLoading,
        channelsCountError: error,
        channelsCountValidating: isValidating,
      };
    }, [
      appointmentsData?.data,
      appointmentsError,
      appointmentsLoading,
      appointmentsValidate,
      channelsData?.data,
      channelsError,
      channelsLoading,
      channelsValidate,
    ]);
    return memoizedValue;
  } catch (error) {
    console.error("Error during get appointments count:", error);
    throw error;
  }
}

export function transformChannelsData(
  data: (ChannelsCount & { channel_name?: string })[] | undefined
): { total: number; series: { label: string; data: number }[] } {
  if (!data || !Array.isArray(data)) return { total: 0, series: [] };

  const sanitized = data.filter((item) => {
    if (!item) return false;
    const countValid =
      item.count !== null &&
      item.count !== undefined &&
      item.count !== "null" &&
      item.count !== "";

    const channelValid =
      item.omni_channel !== null && item.omni_channel !== undefined;

    return countValid && channelValid;
  });

  const sortedData = sanitized.sort((a, b) => a.omni_channel - b.omni_channel);

  const series = sortedData.map((item) => ({
    label: item.channel_name || `Channel ${item.omni_channel}`,
    data: parseInt(item.count, 10) || 0,
  }));

  const total = series.reduce((sum, item) => sum + item.data, 0);

  return { series, total };
}
