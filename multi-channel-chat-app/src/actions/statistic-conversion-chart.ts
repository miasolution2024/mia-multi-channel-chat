import { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

export type ChatsCount = {
  count: string;
};

export type AppointmentsCount = {
  count: string;
};

export function useGetChatsCount() {
  const chatsApi = `${endpoints.conversations.list}?aggregate[count]=*`;

  try {
    const { data, isLoading, error, isValidating } = useSWR(
      chatsApi,
      fetcher,
      swrConfig
    );

    console.log(data);

    const memoizedValue = useMemo(() => {
      const first = Array.isArray(data?.data)
        ? (data?.data[0] as ChatsCount)
        : undefined;
      const chatsCount = first ? parseInt(first.count, 10) || 0 : 0;

      return {
        chatsCount,
        chatsLoading: isLoading,
        chatsError: error,
        chatsValidating: isValidating,
      };
    }, [data?.data, error, isLoading, isValidating]);

    return memoizedValue;
  } catch (error) {
    console.error("Error during get chats count:", error);
    throw error;
  }
}

export function useGetAppointmentsConditionCount() {
  const appointmentsApi = `${endpoints.appointments.list}?aggregate[count]=*&filter[status][_in]=deposited,COMPLETED,visited`;

  try {
    const { data, isLoading, error, isValidating } = useSWR(
      appointmentsApi,
      fetcher,
      swrConfig
    );

    console.log(data);

    const memoizedValue = useMemo(() => {
      const first = Array.isArray(data?.data)
        ? (data?.data[0] as AppointmentsCount)
        : undefined;
      const appointmentsCount = first ? parseInt(first.count, 10) || 0 : 0;

      return {
        appointmentsCount,
        appointmentsLoading: isLoading,
        appointmentsError: error,
        appointmentsValidating: isValidating,
      };
    }, [data?.data, error, isLoading, isValidating]);

    return memoizedValue;
  } catch (error) {
    console.error("Error during get appointments condition count:", error);
    throw error;
  }
}
