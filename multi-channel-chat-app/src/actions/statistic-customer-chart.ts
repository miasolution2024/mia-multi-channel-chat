import { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

// get the appointment data by day
export type AppointmentsCountByDay = {
  date_time_day: number;
  count: string;
};

// get the appointment data by week
export type AppointmentsCountByWeek = {
  date_time_week: number;
  count: string;
};

// get the appointment data by year
export type AppointmentsCountByMonth = {
  date_time_month: number;
  count: string;
};

// Setup the time
export type TimePeriod = "day" | "week" | "month";

// union of the above types, handle different hooking
export type AppointmentsCount =
  | AppointmentsCountByDay
  | AppointmentsCountByWeek
  | AppointmentsCountByMonth;

// fetch and group data from Api by the period
export function useGetAppointmentsCount(period: TimePeriod = "month") {
  const apiUrl = useMemo(() => {
    // fetch the api by different periods, useMemo for performance
    return period === "month"
      ? `${endpoints.appointments.list}?aggregate[count]=*&groupBy[]=${period}(date_time)`
      : `${endpoints.appointments.list}?aggregate[count]=*&groupBy[]=month(date_time)&groupBy[]=${period}(date_time)`;
  }, [period]);

  try {
    const { data, isLoading, error, isValidating } = useSWR(
      apiUrl,
      fetcher,
      swrConfig
    );

    // returns the object with data from the fetch
    const memoizedValue = useMemo(
      () => ({
        appointmentsCount: data?.data as AppointmentsCount[],
        appointmentsCountLoading: isLoading,
        appointmentsCountError: error,
        appointmentsCountValidating: isValidating,
      }),
      [data?.data, isLoading, error, isValidating]
    );
    return memoizedValue;
  } catch (error) {
    console.error("Error during get appointments count:", error);
    throw error;
  }
}

//transforms data into a format suitable for chart visualization
export function transformAppointmentData(
  data: AppointmentsCount[] | undefined,
  period: TimePeriod
): { categories: string[]; data: number[] } {
  //function takes raw appointment data and converts into 2 declared array: categories (xaxis) and data (yaxis)
  if (!data || !Array.isArray(data)) return { categories: [], data: [] }; //return nothing if no data

  const sanitized: AppointmentsCount[] = data.filter((item) => {
    // 1st step: remove any null or undefined data
    if (!item) return false;
    const countValid =
      item.count !== null &&
      item.count !== undefined &&
      item.count !== "null" &&
      item.count !== "";
    switch (period) {
      case "day":
        return (
          "date_time_day" in item &&
          (item as AppointmentsCountByDay).date_time_day !== null &&
          (item as AppointmentsCountByDay).date_time_day !== undefined &&
          countValid
        );
      case "week":
        return (
          "date_time_week" in item &&
          (item as AppointmentsCountByWeek).date_time_week !== null &&
          (item as AppointmentsCountByWeek).date_time_week !== undefined &&
          countValid
        );
      case "month":
        return (
          "date_time_month" in item &&
          (item as AppointmentsCountByMonth).date_time_month !== null &&
          (item as AppointmentsCountByMonth).date_time_month !== undefined &&
          countValid
        );
      default:
        return countValid;
    }
  });

  const sorted = sanitized.sort((a, b) => {
    // 2nd sort data
    switch (period) {
      case "day":
        const dayA = (a as AppointmentsCountByDay).date_time_day;
        const dayB = (b as AppointmentsCountByDay).date_time_day;
        const monthA = (a as AppointmentsCountByMonth).date_time_month;
        const monthB = (b as AppointmentsCountByMonth).date_time_month;

        if (monthA !== monthB) return monthA - monthB;

        return dayA - dayB;
      case "week":
        const weekA = (a as AppointmentsCountByWeek).date_time_week;
        const weekB = (b as AppointmentsCountByWeek).date_time_week;
        return weekA - weekB;
      default:
        return 0;
    }
  });

  const getLabel = (item: AppointmentsCount, period: TimePeriod): string => {
    //generate human-readable labels from the sorted data
    const monthName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIdx = (item as AppointmentsCountByMonth).date_time_month;
    const zeroBasedIdx = Math.max(0, Math.min(11, monthIdx - 1));

    switch (period) {
      case "day":
        if ("date_time_day" in item) {
          return `${(item as AppointmentsCountByDay).date_time_day}/${
            zeroBasedIdx + 1
          }`;
        }
        return "Day";
      case "week":
        if ("date_time_week" in item) {
          return `${(item as AppointmentsCountByWeek).date_time_week}/${
            zeroBasedIdx + 1
          }`;
        }
        return "Week";
      case "month":
        if ("date_time_month" in item) {
          return monthName[zeroBasedIdx] || `Month ${monthIdx}`;
        }
        return "Month";
      default:
        return "Unknown";
    }
  };

  const categories = sorted.map((item) => getLabel(item, period)); //map sorted data to get the human-readable labels
  const counts = sorted.map((item) => parseInt(item.count, 10) || 0);

  return { categories, data: counts };
}
