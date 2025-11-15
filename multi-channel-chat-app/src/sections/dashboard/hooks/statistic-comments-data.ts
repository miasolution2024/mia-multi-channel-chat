import { useGetMultipleFacebookPageData } from "@/actions/dashboard-channels";
import { ChartDataPoint, OmniChoices, ProcessedPageData } from "../type";
import { useMemo } from "react";

export interface UseStatisticCommentDataProps {
  pages: OmniChoices[];
  startDate: string;
  endDate: string;
  period: "day" | "week" | "month";
}

export function useStatisticCommentData({
  pages,
  startDate,
  endDate,
  period,
}: UseStatisticCommentDataProps) {
  const { fbPageData, isLoading, error } = useGetMultipleFacebookPageData(
    pages,
    startDate,
    endDate,
    "comments"
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

      const posts = pageData.data;

      let chartData: ChartDataPoint[] = posts
        .map(
          (item: {
            created_time: string;
            comments?: {
              summary?: {
                total_count?: number;
              };
            };
          }) => {
            if (!item || !item.created_time) return null;

            const createdDate = new Date(item.created_time);
            if (Number.isNaN(createdDate.getTime())) return null;

            const commentsCount =
              (typeof item.comments?.summary?.total_count === "number"
                ? item.comments.summary.total_count
                : 0) ?? 0;

            return {
              x: createdDate.toISOString().split("T")[0],
              y: commentsCount,
            };
          }
        )
        .filter((point: ChartDataPoint | null): point is ChartDataPoint =>
          Boolean(point)
        )
        .filter((point: ChartDataPoint) => {
          const pointDate = new Date(point.x);
          return pointDate >= filterStartDate && pointDate <= filterEndDate;
        });

      chartData = aggregateByDay(chartData);

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

function aggregateByDay(data: ChartDataPoint[]): ChartDataPoint[] {
  if (data.length === 0) return [];

  const dailyData: Record<string, number> = {};

  data.forEach((point) => {
    if (!dailyData[point.x]) {
      dailyData[point.x] = 0;
    }
    dailyData[point.x] += point.y;
  });

  return Object.entries(dailyData)
    .map(([day, value]) => ({ x: day, y: value }))
    .sort((a, b) => a.x.localeCompare(b.x));
}

function aggregateByWeek(data: ChartDataPoint[]): ChartDataPoint[] {
  if (data.length === 0) return [];

  const weeklyData: Record<string, number> = {};

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

  const monthlyData: Record<string, number> = {};

  data.forEach((point) => {
    const date = new Date(point.x);
    if (Number.isNaN(date.getTime())) {
      return;
    }

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
  d.setHours(0, 0, 0, 0);
  return new Date(d.setDate(diff));
}
