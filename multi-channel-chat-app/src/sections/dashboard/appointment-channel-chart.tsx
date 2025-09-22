/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  transformChannelsData,
  useGetChannelsCount,
} from "@/actions/statistic-channel-chart";
import { Alert, Box, Card, CardHeader, Divider } from "@mui/material";
import { useMemo } from "react";

import {
  useTheme,
  alpha as hexAlpha,
  SxProps,
  Theme,
} from "@mui/material/styles";
import { Chart, ChartLegends, useChart } from "@/components/chart";
import { fNumber } from "@/utils/format-number";
import { varAlpha } from "@/theme/styles";

interface AppointmentByChannelChartProps {
  title?: string;
  subheader?: string;
  colors?: string[];
  [key: string]: any;
}

export function AppointmentByChannelChart({
  title,
  subheader,
  colors,
  ...other
}: AppointmentByChannelChartProps) {
  const theme = useTheme() as any;

  const { channelsCount, channelsCountLoading, channelsCountError } =
    useGetChannelsCount();

  const chartData = useMemo(() => {
    if (channelsCountLoading || !channelsCount) {
      return {
        series: [],
        total: [],
      };
    }

    const transformed = transformChannelsData(channelsCount);
    return {
      series: transformed.series,
      total: transformed.total,
    };
  }, [channelsCount, channelsCountLoading]);

  // ApexCharts radialBar expects values from 0 to 100. Convert counts to percentages of total.
  const { chartSeries, data } = useMemo(() => {
    const total = chartData.total || 0;
    if (!total) {
      return {
        chartSeries: chartData.series.map(() => 0),
        data: chartData.series.map(() => 0),
      };
    }

    const percentage = chartData.series.map((item) =>
      Math.round(((Number(item.data) || 0) / (Number(total) || 1)) * 100)
    );

    const number = chartData.series.map((item) => Number(item.data) || 0);

    return {
      chartSeries: percentage,
      data: number,
    };
  }, [chartData.series, chartData.total]);

  const chartColors = useMemo(() => {
    if (colors) return colors;

    const count = Math.max(1, chartData.series.length);
    const saturation = 70; // percent
    const lightness = theme.palette.mode === "dark" ? 55 : 50; // percent
    const hueOffset = 12; // degrees, to avoid starting at pure red

    const generated = Array.from({ length: count }, (_, index) => {
      const hue = Math.round(((360 / count) * index + hueOffset) % 360);
      return `hsl(${hue} ${saturation}% ${lightness}%)`;
    });

    return generated;
  }, [theme.palette.mode, chartData.series.length, colors]);

  const truncatedLabel = useMemo(() => {
    return chartData.series.map((item) =>
      item.label.length > 7 ? item.label.slice(0, 7) + "…" : item.label
    );
  }, [chartData.series]);

  const normalLabel = useMemo(() => {
    return chartData.series.map((item) => item.label);
  }, [chartData.series]);

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: truncatedLabel,
    stroke: { width: 0 },
    fill: { opacity: 1 },
    grid: { padding: { top: -30, bottom: -30 } },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 10,
          size: "32%",
        },
        track: {
          margin: 10,
          background: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        },
        dataLabels: {
          total: { show: true, formatter: () => fNumber(chartData.total) },
          value: { offsetY: 2 },
          name: { offsetY: -10 },
        },
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex }: any) {
        const label = normalLabel[seriesIndex];
        const actualNumber = data[seriesIndex];

        return `
          <div style="padding: 8px 12px; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            <div style="font-weight: 600; margin-bottom: 4px;">${label}</div>
            <div style="color: #666;">Total: ${fNumber(actualNumber)}</div>
          </div>
        `;
      },
    },
  });

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        <Chart
          type="radialBar"
          series={chartSeries}
          options={chartOptions}
          width={{ xs: 305, xl: 325 }}
          height={{ xs: 305, xl: 325 }}
          sx={{ my: 1.5, mx: "auto" }}
          loadingProps={{ sx: { p: 4 } }}
        />

        <Divider sx={{ borderStyle: "dashed" }} />

        <ChartLegends
          labels={truncatedLabel}
          colors={chartColors}
          sx={{ p: 2, justifyContent: "center", flexWrap: "wrap" }}
        />
      </Card>
    </>
  );
}
