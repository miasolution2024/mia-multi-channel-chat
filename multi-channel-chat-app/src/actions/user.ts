import useSWR from "swr";
import { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import { User, UserGroup } from "@/models/auth/user";

// ----------------------------------------------------------------------

export function useGetUsers() {
  const url = endpoints.user.list;

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );

  const memoizedValue = useMemo(
    () => ({
      users: (data?.data as User[]) || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetGroupsByUserId(userId?: string) {
  const url = userId
    ? `${endpoints.userGroups.list}?filter[users][_some][directus_users_id][_eq]=${userId}`
    : "";
  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );

  const memoizedValue = useMemo(
    () => ({
      userGroups: (data?.data as UserGroup[]) || [],
      userGroupsLoading: isLoading,
      userGroupsError: error,
      userGroupsValidating: isValidating,
      userGroupsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetOmniChannelsByUserIdUrl(
  channel: string,
  userId?: string
) {
  if (!userId || !channel) return "";
  const queryParams = new URLSearchParams({
    "filter[omni_channels][_some][omni_channels_id][source][_eq]": channel,
    "filter[users][_some][directus_users_id][_eq]": userId,
    fields: [
      "*",
      "omni_channels.omni_channels_id.page_id",
      "omni_channels.omni_channels_id.id",
      "omni_channels.omni_channels_id.page_name",
      "omni_channels.omni_channels_id.source",
      "omni_channels.omni_channels_id.sort",
    ].join(","),
  }).toString();

  return `${endpoints.userGroups.list}?${queryParams}`;
}

export function useGetOmniChannelsByUserId(channel: string, userId?: string) {
  const url = useGetOmniChannelsByUserIdUrl(channel, userId);
  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );

  const memoizedValue = useMemo(
    () => ({
      omniChannels: ((data?.data as UserGroup[]) || [])
        .flatMap((g) => g.omni_channels.map((c) => c.omni_channels_id))
        .filter((c) => c.source === channel)
        .sort((c) => c.sort),
      omniChannelsLoading: isLoading,
      omniChannelsError: error,
      omniChannelsValidating: isValidating,
      omniChannelsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, channel]
  );

  return memoizedValue;
}
