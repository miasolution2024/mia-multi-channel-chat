/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  transformStatusData,
  useGetStatusCount,
} from "@/actions/statistic-status-chart";
import { Chart, ChartLegends, useChart } from "@/components/chart";
import { fNumber } from "@/utils/format-number";
import { Card, CardHeader, Divider } from "@mui/material";
import {
  useTheme,
  alpha as hexAlpha,
  SxProps,
  Theme,
} from "@mui/material/styles";
import { m } from "framer-motion";
import { useMemo } from "react";

interface EcommerceStatusSalesProps {
  title?: string;
  subheader?: string;
  colors?: string[];
  sx?: SxProps<Theme>;
  [key: string]: any;
}

export function EcommerceStatusSales({
  title,
  subheader,
  colors,
  sx,
  ...other
}: EcommerceStatusSalesProps) {
  const theme = useTheme();

  const { statusCount, statusCountLoading, statusCountError } =
    useGetStatusCount();

  const chartData = useMemo(() => {
    if (statusCountLoading || !statusCount) {
      return {
        series: [],
        total: [],
      };
    }

    const transformedData = transformStatusData(statusCount);

    return {
      series: transformedData.series,
      total: transformedData.total,
    };
  }, [statusCount, statusCountLoading]);

  const chartColors = useMemo(() => {
    if (colors) return colors;

    const statusColorMap = new Map([
      ["Pending", theme.palette.warning.main],
      ["Visited", theme.palette.info.main],
      ["Completed", theme.palette.success.main],
      ["Canceled", theme.palette.error.main],
      ["Confirmed", theme.palette.secondary.main],
    ]);

    const baseColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];

    const colorList: string[] = []; //setup the color, if the status name appear as above, get the color according to the status, if not then increase the opacity of the color for that status
    chartData.series.forEach((status, index) => {
      const statusColor = statusColorMap.get(status.label);
      if (statusColor) colorList.push(statusColor);
      else if (index < baseColors.length) colorList.push(baseColors[index]);
      else {
        const baseIndex = index % baseColors.length;
        const alpha =
          0.3 +
          0.7 *
            ((index - baseColors.length) /
              Math.max(1, chartData.series.length - baseColors.length));
        colorList.push(hexAlpha(baseColors[baseIndex], alpha));
      }
    });
    return colorList;
  }, [theme, chartData.series, colors]);

  const chartSeries = chartData.series.map((item) => Number(item.data) || 0);

  const chartLabel = chartData.series.map((item) => item.label);

  const chartOptions = useChart({
    chart: { sparkline: { enable: true } },
    colors: chartColors,
    labels: chartLabel,
    stroke: { width: 0 },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            value: { formatter: (value: number) => fNumber(value) },
            total: {
              formatter: (w: { globals: { seriesTotals: any[] } }) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Card sx={sx} {...other}>
        <CardHeader title={title} subheader={subheader} />

        <Chart
          type='donut'
          series={chartSeries}
          options={chartOptions}
          sx={{
            my: 4,
            mx: "auto",
            width: { xs: 240, xl: 260 },
            height: { xs: 240, xl: 260 },
          }}
        />

        <Divider sx={{ borderStyle: "dashed" }} />

        <ChartLegends
          labels={chartOptions?.labels}
          colors={chartOptions?.colors}
          values={chartSeries.map((value) => fNumber(value))}
          sx={{ p: 2, justifyContent: "center" }}
        />
      </Card>
    </>
  );
}
