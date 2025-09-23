/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {
  useTheme,
  alpha as hexAlpha,
  SxProps,
  Theme,
} from "@mui/material/styles";

import { fShortenNumber } from "@/utils/format-number";

import { Chart, useChart, ChartSelect, ChartLegends } from "@/components/chart";

import {
  useGetAppointmentsCount,
  transformAppointmentData,
  TimePeriod,
} from "@/actions/statistic-customer-chart";

// ----------------------------------------------------------------------

interface SeriesData {
  name: string;
  data: number[];
}

interface ChartSeries {
  name: string;
  categories: string[];
  data: SeriesData[];
}

interface ChartConfig {
  series: ChartSeries[];
  options?: any;
}

interface AppointmentByTimeChartProps {
  title: string;
  subheader?: string;
  chart: ChartConfig;
  sx?: SxProps<Theme>;
  [key: string]: any; // for ...other props
}

export function AppointmentByTimeChart({
  title,
  subheader,
  chart,
  sx,
  ...other
}: AppointmentByTimeChartProps) {
  const theme = useTheme();

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");

  // const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  const {
    appointmentsCount,
    appointmentsCountLoading,
    appointmentsCountError,
  } = useGetAppointmentsCount(selectedPeriod);

  const chartData = useMemo(() => {
    if (appointmentsCountLoading || !appointmentsCount) {
      return {
        categories: [],
        data: [{ name: "Total", data: [] }],
      };
    }

    const transformed = transformAppointmentData(
      appointmentsCount,
      selectedPeriod
    );
    return {
      categories: transformed.categories,
      data: [{ name: "Total", data: transformed.data }],
    };
  }, [appointmentsCount, appointmentsCountLoading, selectedPeriod]);

  const chartColors = [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.error.main, 0.48),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    // Add fill settings for area chart
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: chartData?.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: hexAlpha(theme.palette.grey[500], 0.2),
    },
    tooltip: {
      y: { formatter: (value: number) => `Total: ${value}` },
      // theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    ...chart.options,
  });

  const periodOptions = useMemo(
    () => [
      { value: "day", label: "Daily" },
      { value: "week", label: "Weekly" },
      { value: "month", label: "Monthly" },
    ],
    []
  );

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      const period = periodOptions.find((option) => option.label === newValue);
      if (period) setSelectedPeriod(period.value as TimePeriod);
    },
    [periodOptions]
  );

  const totalCount =
    chartData.data[0]?.data?.reduce((sum, val) => sum + val, 0) || 0;

  const currentLabel =
    periodOptions.find((option) => option.value === selectedPeriod)?.label ||
    "Monthly";
  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={currentLabel}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        // labels={chart.series[0].data.map((item) => item.name)}
        labels={["Total Appointments"]}
        values={[fShortenNumber(totalCount)]}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="area"
        series={chartData?.data}
        options={chartOptions}
        slotprops={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 358,
        }}
      />
    </Card>
  );
}
