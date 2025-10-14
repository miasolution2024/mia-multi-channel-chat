/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAppointmentsConditionCount,
  useGetChatsCount,
} from "@/actions/statistic-conversion-chart";
import { Chart, useChart } from "@/components/chart";
import { Card, CardHeader, useTheme } from "@mui/material";
import React, { useMemo } from "react";

interface ConversionRateChartProps {
  title?: string;
  subheader?: string;
  colors?: string[];
  [key: string]: any;
}

export function ConversionRateChart({
  title,
  subheader,
  colors,
  ...other
}: ConversionRateChartProps) {
  const theme = useTheme();

  const { chatsCount, chatsLoading } = useGetChatsCount();
  const { appointmentsCount, appointmentsLoading } =
    useGetAppointmentsConditionCount();

  const chartData = useMemo(() => {
    if (chatsLoading || appointmentsLoading) {
      return {
        series: [],
        total: 0,
        rate: 0,
      };
    }

    const chats = Number(chatsCount) ? chatsCount : 0;
    const appointments = Number(appointmentsCount) ? appointmentsCount : 0;

    const total = chats + appointments;
    const rate =
      chats > 0 ? Math.round(Math.min(100, (appointments / chats) * 100)) : 0;

    return {
      series: [
        { label: "Conversations", data: chats },
        { label: "Appointments", data: appointments },
      ],
      total,
      rate,
    };
  }, [chatsCount, appointmentsCount, chatsLoading, appointmentsLoading]);

  const chartColors = colors ?? [
    theme.palette.success.main,
    theme.palette.success.light,
  ];

  const chartErrorColors = colors ?? [
    theme.palette.error.main,
    theme.palette.error.light,
  ];

  const chartOption = useChart({
    chart: { offsetY: 56, sparkline: { enabled: true } },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: chartColors[0], opacity: 1 },
          { offset: 100, color: chartColors[1], opacity: 1 },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { margin: -24 },
        track: {
          margin: -24,
          background: "transparent",
        },
        dataLabels: {
          name: { offsetY: 8 },
          value: { offsetY: -40 },
          total: {
            label: `Total ${appointmentsCount} / ${chatsCount}`,
            color: theme.palette.text.disabled,
            fontSize: theme.typography.caption.fontSize,
            fontWeight: theme.typography.caption.fontWeight,
          },
        },
      },
    },
  });

  // Background chart options for the "no data" part (red gradient)
  const bgChartOption = useChart({
    chart: { offsetY: 56, sparkline: { enabled: true } },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: chartErrorColors[0], opacity: 1 },
          { offset: 100, color: chartErrorColors[1], opacity: 1 },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { margin: -24 },
        track: {
          margin: -24,
          background: "transparent",
        },
        dataLabels: {
          name: { show: false },
          value: { show: false },
          total: { show: false },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
  });

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        <div
          style={{
            position: "relative",
            width: 242,
            height: 242,
            margin: "0 auto",
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <Chart
              type="radialBar"
              series={[100]}
              options={bgChartOption}
              sx={{ width: 260, height: 260 }}
            />
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <Chart
              type="radialBar"
              series={[chartData.rate]}
              options={chartOption}
              sx={{ width: 260, height: 260 }}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
