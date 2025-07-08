import useSWR from "swr";
import { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import { User } from "@/models/auth/user";

// ----------------------------------------------------------------------

export function useGetUsers() {
  const url = endpoints.user.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

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
