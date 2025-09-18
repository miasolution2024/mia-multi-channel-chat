import { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

export type AppointmentStatus =
  | "pending"
  | "visited"
  | "completed"
  | "canceled"
  | "confirmed";

export type StatusCount = {
  status: AppointmentStatus;
  count: string;
};

export function useGetStatusCount() {
  const apiUrl = `${endpoints.appointments.list}?aggregate[count]=*&groupBy[]=status`;

  try {
    const { data, isLoading, error, isValidating } = useSWR(
      apiUrl,
      fetcher,
      swrConfig
    );

    const memoizedValue = useMemo(() => {
      let processedData: (StatusCount & { status_name?: string })[] = [];
      if (data?.data) {
        // for mapping
        const statusMap = new Map<string, string>([
          ["pending", "Pending"],
          ["visited", "Visited"],
          ["completed", "Completed"],
          ["canceled", "Canceled"],
          ["confirmed", "Confirmed"],
        ]);

        type StatusCountWithStringStatus = Omit<StatusCount, "status"> & {
          //make sure all the status is string
          status: string;
        };

        processedData = data.data.map((item: StatusCount) => {
          const rawStatus = (item as StatusCountWithStringStatus).status; // get the status
          const normalizedStatus = String(rawStatus || "") // converts status to lowercase
            .toLowerCase()
            .trim() as AppointmentStatus;

          const status_name = // display the status
            statusMap.get(normalizedStatus) || //display the status
            String(rawStatus || "")
              .charAt(0)
              .toUpperCase() + String(rawStatus || "").slice(1); //converts the status to have the the first letter capitalized

          return {
            ...item,
            status: normalizedStatus,
            status_name,
          } as StatusCount & { status_name?: string };
        });
      }
      return {
        statusCount: processedData,
        statusCountLoading: isLoading,
        statusCountError: error,
        statusCountValidating: isValidating,
      };
    }, [data?.data, isLoading, error, isValidating]);
    return memoizedValue;
  } catch (error) {
    console.error("Error during get status count: ", error);
    throw error;
  }
}

export function transformStatusData(
  data: (StatusCount & { status_name?: string })[] | undefined
): { total: number; series: { label: string; data: number }[] } {
  if (!data || !Array.isArray(data)) return { total: 0, series: [] };

  const sanitized = data.filter((item) => {
    if (!item) return false;
    const countValid =
      item.count !== null &&
      item.count !== undefined &&
      item.count !== "null" &&
      item.count !== "";

    const statusValid = item.status !== null && item.status !== undefined;
    return countValid && statusValid;
  });

  const sortedData = sanitized.sort((a, b) => a.status.localeCompare(b.status));

  const statusOrder: AppointmentStatus[] = [
    //defines the consistent order for status
    "pending",
    "visited",
    "completed",
    "canceled",
    "confirmed",
  ];

  const series = statusOrder.map((statusValue) => {
    const item = sortedData.find((d) => d.status === statusValue);
    return {
      label:
        item?.status_name ||
        statusValue.charAt(0).toUpperCase() + statusValue.slice(1),
      data: item ? parseInt(item.count, 10) || 0 : 0,
    };
  });

  const total = series.reduce((sum, item) => sum + item.data, 0);

  return { total, series };
}
