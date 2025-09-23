/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  transformConversationsData,
  useGetConversationsCount,
} from "@/actions/statistic-conversation-chart";
import { Chart, useChart } from "@/components/chart";
import { Card, CardHeader } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useMemo } from "react";

interface CustomerByChannelChartProps {
  title?: string;
  subheader?: string;
  colors?: string[];
  [key: string]: any;
}

export function CustomerByChannelChart({
  title,
  subheader,
  colors,
  ...other
}: CustomerByChannelChartProps) {
  const theme = useTheme();

  const {
    conversationsCount,
    conversationsCountLoading,
    conversationsCountError,
  } = useGetConversationsCount();

  const chartData = useMemo(() => {
    if (!conversationsCount || conversationsCountLoading) {
      return {
        series: [],
        total: 0,
      };
    }

    const transformedData = transformConversationsData(conversationsCount);
    return {
      series: transformedData.series,
      total: transformedData.total,
    };
  }, [conversationsCount, conversationsCountLoading]);

  const truncatedLabels = useMemo(() => {
    return chartData.series.map((item) =>
      item.label.length > 10 ? item.label.slice(0, 10) + "…" : item.label
    );
  }, [chartData.series]);

  const { categories, seriesData } = useMemo(() => {
    const total = chartData.total || 0;
    const labels = chartData.series.map((item) => item.label);
    if (!total) {
      return {
        categories: truncatedLabels,
        seriesData: [
          { name: "Conversations", data: chartData.series.map(() => 0) },
        ],
      };
    }

    const numbers = chartData.series.map((item) => Number(item.data) || 0);
    return {
      categories: truncatedLabels,
      seriesData: [{ name: "Conversations", data: numbers }],
    };
  }, [chartData.series, chartData.total, truncatedLabels]);

  const chartColors = useMemo(() => {
    if (colors) return colors;

    const count = Math.max(1, chartData.series.length);
    const saturation = 70; // percent
    const lightness = theme.palette.mode === "dark" ? 55 : 50; // percent
    const hueOffset = 12; // degrees, to avoid starting at pure red

    const generatedColor = Array.from({ length: count }, (_, index) => {
      const hue = Math.round(((360 / count) * index + hueOffset) % 360);
      return `hsl(${hue} ${saturation}% ${lightness}%)`;
    });

    return generatedColor;
  }, [theme.palette.mode, chartData.series.length, colors]);

  const chartOptions = useChart({
    colors: chartColors,
    // legend: { show: true },
    xaxis: { categories },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    plotOptions: { bar: { distributed: true } },
    tooltip: {
      y: {
        formatter: (value: any) =>
          value > 1 ? `${value} conversations` : `${value} conversation`,
      },
      x: {
        formatter: (value: any, { dataPointIndex }: any) => {
          return chartData.series[dataPointIndex]?.label || value;
        },
      },
    },
  });

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        <Chart
          type="bar"
          series={seriesData}
          options={chartOptions}
          sx={{ height: 438 }}
        />
      </Card>
    </>
  );
}
