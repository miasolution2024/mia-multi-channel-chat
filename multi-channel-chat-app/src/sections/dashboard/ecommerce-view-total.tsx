import { Iconify } from "@/components/iconify";
import { Box, Card, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { FacebookView, OmniChoices } from "./type";
import { useGetMultipleFacebookPageData } from "@/actions/dashboard-channels";
import {
  calculateDateDistance,
  calculatePreviousDates,
} from "./hooks/use-date-calculation";
interface EcommerceViewTotalProps {
  pages: OmniChoices[];
  startDate: string;
  endDate: string;
  period: string;
}

const EcommerceViewTotal: React.FC<EcommerceViewTotalProps> = ({
  pages,
  startDate,
  endDate,
  period,
}) => {
  const [totalCurrentData, setTotalCurrentData] = useState(0);
  const [totalThenData, setTotalThenData] = useState(0);
  const [arrowDirection, setArrowDirection] = useState("mdi:arrow-up");
  const [arrowColor, setArrowColor] = useState("#1AC052");
  const [percentage, setPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const dateDistance =
    startDate && endDate
      ? calculateDateDistance(period, startDate, endDate)
      : 7;
  const { prevStartDate, prevEndDate } =
    startDate && endDate
      ? calculatePreviousDates(startDate, endDate, dateDistance)
      : { prevStartDate: startDate, prevEndDate: endDate };

  const currentDataResult = useGetMultipleFacebookPageData(
    pages,
    "page_views_total",
    startDate,
    endDate,
    "total"
  );

  const previousDataResult = useGetMultipleFacebookPageData(
    pages,
    "page_views_total",
    prevStartDate,
    prevEndDate,
    "total"
  );

  useEffect(() => {
    if (!pages || pages.length === 0 || !startDate || !endDate) {
      setTotalCurrentData(0);
      setTotalThenData(0);
      setPercentage(0);
      setArrowDirection("mdi:arrow-up");
      setArrowColor("#1AC052");
      return;
    }

    if (currentDataResult.isLoading || previousDataResult.isLoading) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    let totalCurrent = 0;
    if (
      currentDataResult.fbPageData &&
      Array.isArray(currentDataResult.fbPageData)
    ) {
      currentDataResult.fbPageData.forEach((result: FacebookView) => {
        if (result && result.data && result.data.length > 0) {
          const values = result.data[0].values;
          if (values && values.length > 0) {
            totalCurrent += values[0].value || 0;
          }
        }
      });
    }

    let totalPrevious = 0;
    if (
      previousDataResult.fbPageData &&
      Array.isArray(previousDataResult.fbPageData)
    ) {
      previousDataResult.fbPageData.forEach((result: FacebookView) => {
        if (result && result.data && result.data.length > 0) {
          const values = result.data[0].values;
          if (values && values.length > 0) {
            totalPrevious += values[0].value || 0;
          }
        }
      });
    }

    setTotalCurrentData(totalCurrent);
    setTotalThenData(totalPrevious);

    if (totalPrevious === 0) {
      setPercentage(Math.round(totalCurrent * 100));
    } else if (totalPrevious > 0) {
      setPercentage(
        Math.round(
          Math.abs((totalCurrent - totalPrevious) / totalPrevious) * 100
        )
      );
    } else {
      setPercentage(0);
    }

    const isIncreasing = totalCurrent >= totalPrevious;
    setArrowDirection(isIncreasing ? "mdi:arrow-up" : "mdi:arrow-down");
    setArrowColor(isIncreasing ? "#1AC052" : "#DE3B40");
  }, [
    currentDataResult,
    previousDataResult,
    pages,
    startDate,
    endDate,
    totalThenData,
  ]);

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
              //   justifyContent: "center",
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

export default EcommerceViewTotal;
