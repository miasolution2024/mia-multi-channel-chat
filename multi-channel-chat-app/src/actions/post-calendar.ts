import useSWR from "swr";
import axios, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import { OmniChannel } from "@/sections/omni-channel/types";
import { WorkingSchedule } from "@/components/custom-calendar/type";

const baseUrl = `/items/ai_content_suggestions?fields=id,status,user_created,post_type,topic,scheduled_post_time,omni_channels,campaign,date_created,is_schedule`;

//-----------------------------------------------------------------

export function useGetWorkingSchedule(
  searchData: string,
  statusData: string,
  channelData: number[]
  //   creatorData: string
) {
  const omniUrl = `${endpoints.omniChannels.list}?fields=id,page_name`;

  // if one of the below contain data, add it to the url
  let url = baseUrl;
  if (searchData)
    url += `&filter[topic][_contains]=${encodeURIComponent(searchData)}`;
  if (statusData && statusData !== "all")
    url += `&filter[status][_in]=${encodeURIComponent(statusData)}`;
  if (channelData && !channelData.includes(0))
    url += `&filter[omni_channels][_in]=${channelData}`;

  try {
    const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

    const {
      data: omniData,
      isLoading: omniLoading,
      error: omniError,
    } = useSWR(omniUrl, fetcher);

    const memoizedValue = useMemo(() => {
      const schedules = (data?.data as WorkingSchedule[]) || [];
      const omniList = (omniData?.data as OmniChannel[]) || [];

      const omniIdToName = new Map<number, string>();
      for (const item of omniList) {
        if (item && typeof item.id === "number") {
          omniIdToName.set(item.id, item.page_name || "");
        }
      }

      const workingData = schedules.map((item) => {
        const omniIds: number[] = Array.isArray(item?.omni_channels)
          ? (item.omni_channels as number[])
          : [
              typeof item?.omni_channels === "number"
                ? (item.omni_channels as number)
                : item?.omni_channels,
            ].filter((v): v is number => typeof v === "number");

        const omni_channel_names = omniIds.map(
          (id) => omniIdToName.get(id) || ""
        );
        const omni_channel_name = omni_channel_names.filter(Boolean).join(", ");

        return { ...item, omni_channel_name };
      });

      return {
        workingSchedules: workingData,
        workingSchedulesLoading: isLoading || !!omniLoading,
        workingSchedulesError: error || omniError,
        workingSchedulesValidating: isValidating,
        workingSchedulesEmpty: !isLoading && !workingData.length,
      };
    }, [
      data?.data,
      error,
      isLoading,
      isValidating,
      omniData?.data,
      omniError,
      omniLoading,
    ]);

    return memoizedValue;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export function useGetWorkingScheduleStatus() {
  const statusUrl = `/items/ai_content_suggestions?groupBy[]=status`;

  try {
    const { data, isLoading, error } = useSWR(statusUrl, fetcher);

    const memoizedValue = useMemo(
      () => ({
        statusData: data,
        isLoading: isLoading,
        error: error,
      }),
      [data, error, isLoading]
    );
    return memoizedValue;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

//sort out all the null and remain the ones that have work
export function useGetWorkingScheduleOmniChannels() {
  const omniUrl = `${endpoints.omniChannels.list}?fields=id,page_name`;
  const scheduleOmniUrl = `/items/ai_content_suggestions?fields=omni_channels`;

  try {
    const { data, isLoading, error, isValidating } = useSWR(
      scheduleOmniUrl,
      fetcher
    );

    const {
      data: omniData,
      isLoading: omniLoading,
      error: omniError,
    } = useSWR(omniUrl, fetcher);

    const memoizedValue = useMemo(() => {
      const schedules =
        (data?.data as { omni_channels: number | number[] }[]) || [];
      const omniList = (omniData?.data as OmniChannel[]) || [];

      const usedOmniIds = new Set<number>();
      for (const item of schedules) {
        const value = item?.omni_channels as unknown;
        const ids: number[] = Array.isArray(value)
          ? (value as number[]).filter(
              (v): v is number => typeof v === "number"
            )
          : [
              typeof value === "number"
                ? (value as number)
                : (value as unknown),
            ].filter((v): v is number => typeof v === "number");
        for (const id of ids) usedOmniIds.add(id);
      }

      const filtered = omniList
        .filter(
          (omni) =>
            omni && typeof omni.id === "number" && usedOmniIds.has(omni.id)
        )
        .filter((omni) => !!omni.page_name)
        .map((omni) => ({ id: omni.id, page_name: omni.page_name }));

      return {
        omniChannelsData: filtered,
        omniChannelsLoading: isLoading || !!omniLoading,
        omniChannelsError: error || omniError,
        omniChannelsValidating: isValidating,
        omniChannelsEmpty: !isLoading && !filtered.length,
      };
    }, [
      data?.data,
      omniData?.data,
      isLoading,
      isValidating,
      omniLoading,
      error,
      omniError,
    ]);

    return memoizedValue;
  } catch (error) {
    console.error("Error fetching omni channels:", error);
    throw error;
  }
}

export async function updateWorkingSchedulePost(
  scheduleId: string,
  scheduleDateTime: string
) {
  try {
    const url = `/items/ai_content_suggestions/${scheduleId}`;
    const response = await axios.patch(url, {
      is_schedule: true,
      scheduled_post_time: scheduleDateTime,
    });
    if ((response.status = 200)) {
      return response.data;
    }
  } catch (error) {
    console.error("Error during update conversation:", error);
    throw error;
  }
}
