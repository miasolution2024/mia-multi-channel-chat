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

interface EcommerceChannelSalesProps {
  title?: string;
  subheader?: string;
  colors?: string[];
  [key: string]: any;
}

export function EcommerceChannelSales({
  title,
  subheader,
  colors,
  ...other
}: EcommerceChannelSalesProps) {
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

    const baseColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];

    const colorList: string[] = [];
    for (let i = 0; i < chartData.series.length; i++) {
      if (i < baseColors.length) {
        colorList.push(baseColors[i]);
      } else {
        // Generate additional colors with alpha variations
        const baseIndex = i % baseColors.length;
        const alpha =
          0.3 +
          0.7 *
            ((i - baseColors.length) /
              Math.max(1, chartData.series.length - baseColors.length));
        colorList.push(hexAlpha(baseColors[baseIndex], alpha));
      }
    }
    return colorList;
  }, [theme, chartData.series.length, colors]);

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
          type='radialBar'
          series={chartSeries}
          options={chartOptions}
          width={{ xs: 300, xl: 320 }}
          height={{ xs: 280, xl: 300 }}
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
