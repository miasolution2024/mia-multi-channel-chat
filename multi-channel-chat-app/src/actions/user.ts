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

export function getUserGroupByIdsUrl(userGroupIds: string[]) {
  if (!userGroupIds) return "";
  const queryParams = new URLSearchParams({
    "filter[id][_in]": userGroupIds.join(","),
    fields: [
      "*",
      "users.directus_users_id.id",
      "users.directus_users_id.first_name",
      "users.directus_users_id.last_name",
    ].join(","),
  }).toString();

  return `${endpoints.userGroups.list}?${queryParams}`;
}

export function useGetUsersByGroupIds(userGroupIds: string[]) {
  const url = getUserGroupByIdsUrl(userGroupIds);
  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig
  );

  const memoizedValue = useMemo(
    () => ({
      users: ((data?.data as UserGroup[]) || []).flatMap((ug) =>
        ug.users.map((u) => u.directus_users_id)
      ),
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
