import React, { useEffect, useMemo, useState } from "react";
import { DashboardTotalData, OmniChoices } from "./type";
import { useGetTotalDashboardData } from "@/actions/dashboard-channels";
import { Iconify } from "@/components/iconify";
import { Card, Box, Typography } from "@mui/material";

interface EcommerceViewsTotalProps {
  pages: OmniChoices[];
  startDate: string;
  endDate: string;
}

const EcommerceViewsTotal: React.FC<EcommerceViewsTotalProps> = ({
  pages,
  startDate,
  endDate,
}) => {
  const [viewsTotal, setViewsTotal] = useState<DashboardTotalData[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [arrowDirection, setArrowDirection] = useState("mdi:arrow-up");
  const [arrowColor, setArrowColor] = useState("#1AC052");

  const { dashboardData, isLoading } = useGetTotalDashboardData(
    pages,
    "views",
    startDate,
    endDate
  );

  useEffect(() => {
    if (!pages || pages.length === 0 || !startDate || !endDate) {
      setViewsTotal([]);
      return;
    }

    if (Array.isArray(dashboardData?.data)) {
      const dashboardTotalData: DashboardTotalData[] = dashboardData.data.map(
        (item: {
          id: number;
          views_count?: number;
          prev_views_count?: number;
        }) => ({
          id: item.id,
          presentData: item.views_count ?? 0,
          previosData: item.prev_views_count ?? 0,
        })
      );
      setViewsTotal(dashboardTotalData);
    } else {
      setViewsTotal([]);
    }
  }, [dashboardData, pages, startDate, endDate]);

  const totalCurrentData = useMemo(
    () =>
      viewsTotal.reduce(
        (sum, item) =>
          sum + (Number.isFinite(item.presentData) ? item.presentData : 0),
        0
      ),
    [viewsTotal]
  );

  const totalPreviousData = useMemo(
    () =>
      viewsTotal.reduce(
        (sum, item) =>
          sum + (Number.isFinite(item.previosData) ? item.previosData : 0),
        0
      ),
    [viewsTotal]
  );

  useEffect(() => {
    if (totalPreviousData === 0) {
      setPercentage(
        totalCurrentData === 0 ? 0 : Math.round(totalCurrentData * 100)
      );
      setArrowDirection(
        totalCurrentData >= 0 ? "mdi:arrow-up" : "mdi:arrow-down"
      );
      setArrowColor(totalCurrentData >= 0 ? "#1AC052" : "#DE3B40");
      return;
    }

    const difference = totalCurrentData - totalPreviousData;
    const isIncreasing = difference >= 0;
    const percentChange = Math.round(
      Math.abs(difference / totalPreviousData) * 100
    );

    setPercentage(percentChange);
    setArrowDirection(isIncreasing ? "mdi:arrow-up" : "mdi:arrow-down");
    setArrowColor(isIncreasing ? "#1AC052" : "#DE3B40");
  }, [totalCurrentData, totalPreviousData]);

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "155px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow:
            "0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)",
        }}
      >
        <Box
          sx={{
            padding: "17px 24px 19px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "100%",
                padding: "6px",
                backgroundColor: "#D7E6F8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
              }}
            >
              <Iconify icon="flowbite:eye-solid" style={{ color: "#2373D3" }} />
            </Box>

            <Box
              sx={{
                marginLeft: "16px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Public Sans Variable",
                  color: "#9095A1",
                  fontSize: "16px",
                  lineHeight: "26px",
                  fontWeight: "500px",
                }}
              >
                Lượt xem
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              my: "8px",
              color: "#323743",
              fontFamily: "Public Sans Variable",
              fontSize: "32px",
              lineHeight: "48px",
              fontWeight: 700,
            }}
          >
            {isLoading ? "..." : totalCurrentData.toLocaleString()}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Iconify
                icon={arrowDirection}
                width="12"
                height="12"
                style={{ color: arrowColor }}
              />
              <Typography
                sx={{
                  marginLeft: "4px",
                  fontSize: "12px",
                  fontFamily: "Public Sans Variable",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: arrowColor,
                }}
              >
                {isLoading ? "..." : `${percentage}%`}
              </Typography>
            </Box>

            <Typography
              sx={{
                marginLeft: "4px",
                fontSize: "12px",
                fontFamily: "Public Sans Variable",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#323743",
              }}
            >
              so với kỳ trước
            </Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default EcommerceViewsTotal;
