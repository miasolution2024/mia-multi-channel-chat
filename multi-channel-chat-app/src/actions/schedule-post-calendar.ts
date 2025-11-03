import useSWR from "swr";
import axios, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import {
  CampaignInfo,
  UserInfo,
  WorkingSchedule,
} from "@/components/custom-calendar/type";
import { CampaignOmniChannel } from "@/types/campaign";

const baseUrl = `/items/ai_content_suggestions?fields=id,status,user_created,user_created.id,user_created.first_name,user_created.last_name,post_type,topic,scheduled_post_time,omni_channels,campaign,date_created,is_schedule&limit=1000`;

//-----------------------------------------------------------------

export function useGetWorkingSchedule(
  searchData: string,
  statusData: string,
  channelData: number[],
  creatorData: string[]
  //   creatorData: string
) {
  const omniUrl = `${endpoints.omniChannels.list}?fields=id,page_name&limit=1000`;
  const userInfoUrl = `/items/ai_content_suggestions?fields=user_created.id,user_created.first_name,user_created.last_name&limit=1000`;
  const campaignUrl = `items/campaign?fields=id,name&limit=1000`;

  // if one of the below contain data, add it to the url
  let url = baseUrl;
  if (searchData)
    url += `&filter[topic][_contains]=${encodeURIComponent(searchData)}`;
  if (statusData && statusData !== "all")
    url += `&filter[status][_in]=${encodeURIComponent(statusData)}`;
  if (channelData && channelData.length > 0 && !channelData.includes(0))
    url += `&filter[omni_channels][_in]=${channelData}`;
  if (creatorData && creatorData.length > 0 && !creatorData.includes("0"))
    url += `&filter[user_created][_in]=${creatorData}`;

  try {
    const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

    const {
      data: omniData,
      isLoading: omniLoading,
      error: omniError,
    } = useSWR(omniUrl, fetcher);

    const {
      data: userInfoData,
      isLoading: userInfoLoading,
      error: userInfoError,
    } = useSWR(userInfoUrl, fetcher);

    const {
      data: campaignData,
      isLoading: campaignLoading,
      error: campaignError,
    } = useSWR(campaignUrl, fetcher);

    const memoizedValue = useMemo(() => {
      const schedules = (data?.data as WorkingSchedule[]) || [];
      const omniList = (omniData?.data as CampaignOmniChannel[]) || [];
      const userInfoList = (userInfoData?.data as UserInfo[]) || [];
      const campaignList = (campaignData?.data as CampaignInfo[]) || [];

      const omniIdToName = new Map<number, string>();
      for (const item of omniList) {
        if (item && typeof item.id === "number") {
          omniIdToName.set(item.id, item.page_name || "");
        }
      }

      const userInfoToFullName = new Map<string, string>();
      for (const item of userInfoList) {
        if (item) {
          const fullName = `${item.first_name || null} ${
            item.last_name || null
          }`.trim();
          userInfoToFullName.set(item.id, fullName);
        }
      }

      const campaignIdToName = new Map<number, string>();
      for (const item of campaignList) {
        if (item && typeof item.id === "number") {
          campaignIdToName.set(item.id, item.name);
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

        let user_created_name = "";
        if (item.user_created && typeof item.user_created === "object") {
          const userCreated = item.user_created as {
            id: string;
            first_name: string | null;
            last_name: string | null;
          };
          if (userCreated.first_name || userCreated.last_name) {
            user_created_name = `${userCreated.first_name || ""} ${
              userCreated.last_name || ""
            }`.trim();
          }
        } else if (typeof item.user_created === "string") {
          user_created_name = userInfoToFullName.get(item.user_created) || "";
        }

        let campaign_name = "";
        if (item.campaign && typeof item.campaign === "number") {
          campaign_name = campaignIdToName.get(item.campaign) || "";
        }

        return { ...item, omni_channel_name, user_created_name, campaign_name };
      });

      return {
        workingSchedules: workingData,
        workingSchedulesLoading:
          isLoading || !!omniLoading || !!userInfoLoading || campaignLoading,
        workingSchedulesError:
          error || omniError || userInfoError || campaignError,
        workingSchedulesValidating: isValidating,
        workingSchedulesEmpty: !isLoading && !workingData.length,
      };
    }, [
      campaignData?.data,
      campaignError,
      campaignLoading,
      data?.data,
      error,
      isLoading,
      isValidating,
      omniData?.data,
      omniError,
      omniLoading,
      userInfoData?.data,
      userInfoError,
      userInfoLoading,
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

export function useGetWorkingScheduleUsernames() {
  const userInfoUrl = `/items/ai_content_suggestions?fields=user_created.id,user_created.first_name,user_created.last_name&limit=1000`;

  try {
    const { data, isLoading, error } = useSWR(userInfoUrl, fetcher);

    const memoizedValue = useMemo(() => {
      const userInfoList = (data?.data as { user_created: UserInfo }[]) || [];

      const userInfoToFullName = new Map<string, string>();
      const uniqueUsers = new Map<string, UserInfo>();

      for (const item of userInfoList) {
        if (item && item.user_created) {
          const userCreated = item.user_created;
          const fullName = `${userCreated.first_name || null} ${
            userCreated.last_name || null
          }`.trim();

          if (!uniqueUsers.has(userCreated.id)) {
            uniqueUsers.set(userCreated.id, userCreated);
            userInfoToFullName.set(userCreated.id, fullName);
          }
        }
      }

      return {
        userInfoData: Array.from(uniqueUsers.values()),
        userInfoToFullName,
        isLoading: isLoading,
        error: error,
      };
    }, [data, error, isLoading]);

    return memoizedValue;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

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
      const omniList = (omniData?.data as CampaignOmniChannel[]) || [];

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
