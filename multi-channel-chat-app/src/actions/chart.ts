import { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

export type CustomerCount = {
  created_at_month: number;
  count: string;
};

export function useGetCustomersCount(year: number) {
  try {
    const { data, isLoading, error, isValidating } = useSWR(
      `${endpoints.customers.list}?aggregate[count]=*&groupBy[]=month(created_at)&filter[year(created_at)][_eq]=${year}`,
      fetcher,
      swrConfig
    );

    const memoizedValue = useMemo(
      () => ({
        customersCount: data?.data as CustomerCount[],
        customersCountLoading: isLoading,
        customersCountError: error,
        customersCountValidating: isValidating,
      }),
      [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
  } catch (error) {
    console.error("Error during get customer count:", error);
    throw error;
  }
}

export type MessageCount = {
  date_created_day: number;
  count: string;
};

export function useGetMessagesCount() {
  try {
    const { data, isLoading, error, isValidating } = useSWR(
      `${endpoints.messages.list}?aggregate[count]=*&groupBy[]=day(date_created)`,
      fetcher,
      swrConfig
    );

    const memoizedValue = useMemo(
      () => ({
        messagesCount: data?.data as MessageCount[],
        messagesCountLoading: isLoading,
        messagesCountError: error,
        messagesCountValidating: isValidating,
      }),
      [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
  } catch (error) {
    console.error("Error during get customer count:", error);
    throw error;
  }
}

export type AppointmentCount = {
  status: number;
  count: string;
};

export function useGetAppointmentsCount() {
  try {
    const { data, isLoading, error, isValidating } = useSWR(
      `${endpoints.appointments.list}?aggregate[count]=*&groupBy[]=status`,
      fetcher,
      swrConfig
    );

    const memoizedValue = useMemo(
      () => ({
        appointmentsCount: data?.data as AppointmentCount[],
        appointmentsCountLoading: isLoading,
        appointmentsCountError: error,
        appointmentsCountValidating: isValidating,
      }),
      [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
  } catch (error) {
    console.error("Error during get appointment count:", error);
    throw error;
  }
}

export type FBCommentCount = {
  date_created_month: number;
  count: string;
};

export function useGetConversationsCount(year: number) {
  try {
    const { data, isLoading, error, isValidating } = useSWR(
      `${endpoints.conversations.list}?aggregate[count]=*&groupBy[]=month(date_created)&filter[year(date_created)][_eq]=${year}`,
      fetcher,
      swrConfig
    );

    const memoizedValue = useMemo(
      () => ({
        conversationsCount: data?.data as FBCommentCount[],
        conversationsCountLoading: isLoading,
        conversationsCountError: error,
        conversationsCountValidating: isValidating,
      }),
      [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
  } catch (error) {
    console.error("Error during get conversations count:", error);
    throw error;
  }
}
