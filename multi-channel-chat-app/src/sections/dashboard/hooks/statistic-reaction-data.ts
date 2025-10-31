import { useMemo } from "react";
import { useGetMultipleFacebookPageData } from "@/actions/dashboard-channels";
import { OmniChoices } from "../type";

export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface ProcessedPageData {
  pageName: string;
  pageId: string;
  data: ChartDataPoint[];
  color: string;
}

export interface UseStatisticReactionDataProps {
  pages: OmniChoices[];
  method: string;
  startDate: string;
  endDate: string;
  period: "day" | "week" | "month";
}

export function useStatisticReactionData({
  pages,
  method,
  startDate,
  endDate,
  period,
}: UseStatisticReactionDataProps) {
  const { fbPageData, isLoading, error } = useGetMultipleFacebookPageData(
    pages,
    method,
    startDate,
    endDate,
    "chart"
  );

  const processedData = useMemo(() => {
    if (!fbPageData || !Array.isArray(fbPageData) || pages.length === 0) {
      return [];
    }

    const colors = [
      "#1976d2", // Primary blue
      "#ed6c02", // Orange
      "#2e7d32", // Green
      "#d32f2f", // Red
      "#7b1fa2", // Purple
      "#f57c00", // Amber
      "#388e3c", // Dark green
      "#c2185b", // Pink
    ];

    const result: ProcessedPageData[] = [];

    const filterStartDate = new Date(startDate);
    const filterEndDate = new Date(endDate);

    pages.forEach((page, index) => {
      const pageData = fbPageData[index];

      if (!pageData || !pageData.data || !Array.isArray(pageData.data)) {
        return;
      }

      const insightsData = pageData.data[0];
      if (
        !insightsData ||
        !insightsData.values ||
        !Array.isArray(insightsData.values)
      ) {
        return;
      }

      let chartData: ChartDataPoint[] = insightsData.values
        .map(
          (item: {
            end_time: string;
            value: {
              like: number;
              love: number;
              wow: number;
              haha: number;
              sorry: number;
              anger: number;
            };
          }) => {
            // Sum all emotions for the total reaction count
            const totalReactions =
              (item.value.like || 0) +
              (item.value.love || 0) +
              (item.value.wow || 0) +
              (item.value.haha || 0) +
              (item.value.sorry || 0) +
              (item.value.anger || 0);

            return {
              x: new Date(item.end_time).toISOString().split("T")[0],
              y: totalReactions,
            };
          }
        )
        .filter((point: { x: string }) => {
          const pointDate = new Date(point.x);
          return pointDate >= filterStartDate && pointDate <= filterEndDate;
        });

      if (period === "week") {
        chartData = aggregateByWeek(chartData);
      } else if (period === "month") {
        chartData = aggregateByMonth(chartData);
      }

      result.push({
        pageName: page.page_name,
        pageId: page.page_id,
        data: chartData,
        color: colors[index % colors.length],
      });
    });

    return result;
  }, [endDate, fbPageData, pages, period, startDate]);

  const hasEnoughData = useMemo(() => {
    if (!processedData || processedData.length === 0) return false;

    return processedData.some((page) => page.data.length > 0);
  }, [processedData]);

  return {
    processedData,
    isLoading,
    error,
    hasEnoughData,
  };
}

function aggregateByWeek(data: ChartDataPoint[]): ChartDataPoint[] {
  if (data.length === 0) return [];

  const weeklyData: { [key: string]: number } = {};

  data.forEach((point) => {
    const date = new Date(point.x);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = 0;
    }
    weeklyData[weekKey] += point.y;
  });

  return Object.entries(weeklyData)
    .map(([week, value]) => ({ x: week, y: value }))
    .sort((a, b) => a.x.localeCompare(b.x));
}

function aggregateByMonth(data: ChartDataPoint[]): ChartDataPoint[] {
  if (data.length === 0) return [];

  const monthlyData: { [key: string]: number } = {};

  data.forEach((point) => {
    const date = new Date(point.x);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = 0;
    }
    monthlyData[monthKey] += point.y;
  });

  return Object.entries(monthlyData)
    .map(([month, value]) => ({ x: month, y: value }))
    .sort((a, b) => a.x.localeCompare(b.x));
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}
