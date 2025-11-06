import useSWR from "swr";
import axios, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import {
  CampaignInfo,
  UserInfo,
  WorkingSchedule,
  OmniChoices,
} from "@/components/custom-calendar/type";
import { useAuthContext } from "@/auth/hooks/use-auth-context";

// const baseUrl = `/items/ai_content_suggestions?fields=id,status,user_created,user_created.id,user_created.first_name,user_created.last_name,post_type,topic,scheduled_post_time,omni_channels,campaign,date_created,is_schedule&limit=1000`;
const baseUrl = `/items/ai_content_suggestions?fields=id,status,user_created,user_created,post_type,topic,scheduled_post_time,omni_channels,campaign,date_created,is_schedule&limit=1000`;

//-----------------------------------------------------------------

export function useGetWorkingSchedule(
  searchData: string,
  statusData: string,
  channelData: number[]
  // creatorData: string[]
  //   creatorData: string
) {
  const { user } = useAuthContext();

  const omniUrl = `${endpoints.omniChannels.list}?fields=id,page_name,ai_content_suggestions&limit=1000`;
  const userInfoUrl = `/users?field=id,first_name,last_name&limit=1000`;
  const campaignUrl = `items/campaign?fields=id,name&limit=1000`;

  let url = baseUrl;
  if (searchData)
    url += `&filter[topic][_contains]=${encodeURIComponent(searchData)}`;
  if (statusData && statusData !== "all")
    url += `&filter[status][_in]=${encodeURIComponent(statusData)}`;
  if (channelData && channelData.length > 0 && !channelData.includes(0))
    url += `&filter[omni_channels][_in]=${channelData}`;
  if (user && user.id !== undefined && user.id !== null) {
    url += `&filter[user_created][_eq]=${user.id}`;
  }
  // if (creatorData && creatorData.length > 0 && !creatorData.includes("0"))
  //   url += `&filter[user_created][_in]=${creatorData}`;

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
      const omniList = (omniData?.data as OmniChoices[]) || [];
      const userInfoList = (userInfoData?.data as UserInfo[]) || [];
      const campaignList = (campaignData?.data as CampaignInfo[]) || [];

      const omniIdToName = new Map<number, string>();
      for (const item of omniList) {
        if (item && typeof item.id === "number") {
          omniIdToName.set(item.id, item.page_name || "");
        }
      }

      // const aiNamesCache = new Map<number, string[]>();
      // const getAiNamesForSuggestion = (suggestionId: number): string[] => {
      //   const cached = aiNamesCache.get(suggestionId);
      //   if (cached) return cached;
      //   const names = omniList
      //     .filter((omni) =>
      //       Array.isArray(omni.ai_content_suggestions)
      //         ? omni.ai_content_suggestions.includes(suggestionId)
      //         : false
      //     )
      //     .map((omni) => omni.page_name)
      //     .filter(Boolean);
      //   aiNamesCache.set(suggestionId, names);
      //   return names;
      // };

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

      // const uniqueUsers = new Map<string, UserInfo>();

      // for (const item of schedules) {
      //   if (item.user_created && typeof item.user_created === "string") {
      //     const userId = item.user_created;
      //     const fullName = userInfoToFullName.get(userId) || "";
      //     const nameParts = fullName.trim().split(" ");
      //     const firstName = nameParts[0] || "";
      //     const lastName = nameParts.slice(1).join(" ") || "";

      //     if (userId && !uniqueUsers.has(userId)) {
      //       const fullNameFormatted = `${firstName} ${lastName}`.trim();
      //       uniqueUsers.set(userId, {
      //         id: userId,
      //         first_name: firstName,
      //         last_name: lastName,
      //         full_name: fullNameFormatted,
      //       });
      //     }
      //   }
      // }

      const uniqueOmnis = new Map<number, OmniChoices>();

      for (const item of schedules) {
        const omniIdsForItem: number[] = Array.isArray(item?.omni_channels)
          ? (item.omni_channels as number[])
          : [
              typeof item?.omni_channels === "number"
                ? (item.omni_channels as number)
                : item?.omni_channels,
            ].filter((v): v is number => typeof v === "number");

        for (const ref of omniIdsForItem) {
          if (!ref && ref !== 0) continue;
          for (const omni of omniList) {
            if (
              omni &&
              Array.isArray(omni.ai_content_suggestions) &&
              omni.ai_content_suggestions.includes(ref)
            ) {
              if (typeof omni.id === "number") uniqueOmnis.set(omni.id, omni);
            }
          }
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

        const namesSet = new Set<string>();
        for (const ref of omniIds) {
          for (const omni of omniList) {
            if (
              omni &&
              Array.isArray(omni.ai_content_suggestions) &&
              omni.ai_content_suggestions.includes(ref) &&
              omni.page_name
            ) {
              namesSet.add(omni.page_name);
            }
          }
        }

        const omni_channel_name = Array.from(namesSet).join(", ");

        let user_created_name = "";
        if (item.user_created && typeof item.user_created === "string") {
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
        uniqueOmnis: Array.from(uniqueOmnis.values()),
        // uniqueUsers: Array.from(uniqueUsers.values()),
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
  const omniUrl = `${endpoints.omniChannels.list}?fields=id,page_name&limit=1000`;
  const scheduleOmniUrl = `/items/ai_content_suggestions?fields=omni_channels&limit=1000`;

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
      const omniList = (omniData?.data as OmniChoices[]) || [];

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
