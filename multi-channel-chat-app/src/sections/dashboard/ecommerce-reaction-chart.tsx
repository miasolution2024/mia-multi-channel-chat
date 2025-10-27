import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Chart, useChart, ChartLegends } from "@/components/chart";
import { useStatisticReactionData } from "./hooks/statistic-reaction-data";
import { OmniChoices } from "./type";

interface EcommerceReactionChartProps {
  pages: OmniChoices[];
  startDate: string;
  endDate: string;
}

const EcommerceReactionChart: React.FC<EcommerceReactionChartProps> = ({
  pages,
  startDate,
  endDate,
}) => {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month"
  >("week");

  const { processedData, isLoading, error, hasEnoughData } =
    useStatisticReactionData({
      pages,
      method: "page_actions_post_reactions_total",
      startDate,
      endDate,
      period: selectedPeriod,
    });

  const chartSeries = useMemo(() => {
    if (!processedData || processedData.length === 0) return [];

    return processedData.map((pageData) => ({
      name: pageData.pageName,
      data: pageData.data,
    }));
  }, [processedData]);

  const chartColors = useMemo(() => {
    if (!processedData || processedData.length === 0) return [];
    return processedData.map((pageData) => pageData.color);
  }, [processedData]);

  const chartCategories = useMemo(() => {
    if (!processedData || processedData.length === 0) return [];

    const allDates = new Set<string>();
    processedData.forEach((pageData) => {
      pageData.data.forEach((point) => {
        allDates.add(point.x);
      });
    });

    return Array.from(allDates).sort();
  }, [processedData]);

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: {
      categories: chartCategories,
      type: "datetime",
      labels: {
        format:
          selectedPeriod === "day"
            ? "dd/MM"
            : selectedPeriod === "week"
            ? "dd/MM"
            : "MM/yyyy",
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: "Lượt tương tác",
      },
      labels: {
        formatter: (value: number) => value.toLocaleString(),
      },
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => value.toLocaleString(),
      },
      theme: "light",
    },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
    },
  });

  const handlePeriodChange = (
    event: SelectChangeEvent<"day" | "week" | "month">
  ) => {
    setSelectedPeriod(event.target.value as "day" | "week" | "month");
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow:
            "0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)",
        }}
      >
        <Box
          sx={{
            padding: "24px",
            textAlign: "center",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={40} />
          <Typography
            sx={{
              color: "#9095A1",
              fontSize: "16px",
              fontFamily: "Public Sans Variable",
              marginTop: "16px",
            }}
          >
            Đang tải dữ liệu...
          </Typography>
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow:
            "0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)",
        }}
      >
        <Box sx={{ padding: "24px" }}>
          <Alert severity="error">
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
          </Alert>
        </Box>
      </Card>
    );
  }

  // Show empty state
  if (!hasEnoughData || !pages || pages.length === 0) {
    return (
      <Card
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow:
            "0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)",
        }}
      >
        <Box
          sx={{
            padding: "24px",
            textAlign: "center",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#9095A1",
              fontSize: "16px",
              fontFamily: "Public Sans Variable",
            }}
          >
            {!pages || pages.length === 0
              ? "Chưa có dữ liệu để hiển thị. Vui lòng chọn trang và khoảng thời gian."
              : "Không có dữ liệu lượt tương tác trong khoảng thời gian đã chọn."}
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow:
          "0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)",
      }}
    >
      <Box sx={{ padding: "24px 24px 0" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Typography
            sx={{
              color: "#323743",
              fontSize: "20px",
              lineHeight: "30px",
              fontFamily: "Public Sans Variable",
              fontWeight: 700,
            }}
          >
            Lượt tương tác
          </Typography>

          <FormControl size="small" sx={{ minWidth: "fit-content" }}>
            <Select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              sx={{
                backgroundColor: "transparent",
                color: "#2373D3",
                width: "fit-content",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "6px",
                minHeight: "36px",
                fontSize: "14px",
                lineHeight: "22px",
                fontFamily: "Public Sans Variable",
                padding: "0 12px",
                fontWeight: 700,
                gap: "6px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2373D3",
                  borderWidth: "1px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2373D3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2373D3",
                  borderWidth: "1px",
                },
                "& .MuiSelect-select": {
                  padding: "8px 0",
                },
                "&:disabled": {
                  opacity: 0.4,
                },
              }}
            >
              <MenuItem value="day">Ngày</MenuItem>
              <MenuItem value="week">Tuần</MenuItem>
              <MenuItem value="month">Tháng</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Chart Legend */}
        {processedData && processedData.length > 0 && (
          <ChartLegends
            colors={chartColors}
            labels={processedData.map((page) => page.pageName)}
            sx={{ mb: 2 }}
          />
        )}
      </Box>

      {/* Chart */}
      <Box sx={{ padding: "0 24px 24px" }}>
        <Chart
          type="line"
          series={chartSeries}
          options={chartOptions}
          height={400}
          loadingProps={{ sx: { p: 2.5 } }}
        />
      </Box>
    </Card>
  );
};

export default EcommerceReactionChart;
