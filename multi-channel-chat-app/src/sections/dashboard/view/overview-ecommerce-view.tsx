"use client";

import { DashboardContent } from "@/layouts/dashboard";

import { Grid2 as Grid } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import DropdownSourceChoice from "../components/dropdown-source-choice";
import DropdownPageChoice from "../components/dropdown-page-choice";
import DropdownCalendarChoice from "../components/dropdown-calendar-choice";
import { OmniChoices, DashboardData } from "../type";
import { callDashboardWebhook } from "@/actions/dashboard-webhook";
import EcommerceReactionsTotal from "../ecommerce-reactions-total";
import EcommerceViewsTotal from "../ecommerce-views-total";
import EcommerceCommentsTotal from "../ecommerce-comments-total";
import EcommerceSharesTotal from "../ecommerce-shares-total";
import EcommerceViewChart from "../ecommerce-view-chart";
import EcommerceReactionChart from "../ecommerce-reaction-chart";
import EcommerceSharesChart from "../ecommerce-shares-chart";
import EcommerceCommentsChart from "../ecommerce-comments-chart";
import EcommercePostsData from "../ecommerce-posts-data";

// ----------------------------------------------------------------------

export function OverviewEcommerceView() {
  const [sourceChoice, setSourceChoice] = useState("Facebook");
  const [pageChoices, setPageChoices] = useState<OmniChoices[]>([]);
  const [startDayChoice, setStartDayChoice] = useState<string>("");
  const [endDayChoice, setEndDayChoice] = useState<string>("");
  const [prevStartDate, setPrevStartDate] = useState<string>("");
  const [prevEndDate, setPrevEndDate] = useState<string>("");
  const [periodChoice, setPeriodChoice] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const previousDatesKeyRef = useRef<string>("");
  const sentPagesForCurrentDateRangeRef = useRef<Set<string>>(new Set());

  console.log(dashboardData);

  useEffect(() => {
    const isDataComplete =
      pageChoices.length > 0 &&
      startDayChoice !== "" &&
      endDayChoice !== "" &&
      prevStartDate !== "" &&
      prevEndDate !== "";

    if (isDataComplete) {
      const datesKey = `${startDayChoice}|${endDayChoice}|${prevStartDate}|${prevEndDate}`;
      const currentPagesSet = new Set(
        pageChoices.map((p) => `${p.page_id}:${p.token}`)
      );

      // dates changed (or first run), reset tracking and send all selected pages
      if (datesKey !== previousDatesKeyRef.current) {
        const pagesData = pageChoices.map((page) => ({
          id: page.id,
          page_id: page.page_id,
          token: page.token,
        }));

        callDashboardWebhook({
          pages: pagesData,
          start_date: startDayChoice,
          end_date: endDayChoice,
          prev_start_date: prevStartDate,
          prev_end_date: prevEndDate,
        });
        previousDatesKeyRef.current = datesKey;
        // Reset tracking, mark all current pages as sent
        sentPagesForCurrentDateRangeRef.current = new Set(currentPagesSet);
      } else {
        // Dates unchanged -> only send pages that haven't been sent for this date range yet
        const pagesToSend = pageChoices.filter(
          (p) =>
            !sentPagesForCurrentDateRangeRef.current.has(
              `${p.page_id}:${p.token}`
            )
        );

        if (pagesToSend.length > 0) {
          const pagesData = pagesToSend.map((page) => ({
            id: page.id,
            page_id: page.page_id,
            token: page.token,
          }));

          callDashboardWebhook({
            pages: pagesData,
            start_date: startDayChoice,
            end_date: endDayChoice,
            prev_start_date: prevStartDate,
            prev_end_date: prevEndDate,
          });

          // tracking even if removed later, to avoid re-sending if re-added
          pagesToSend.forEach((page) => {
            sentPagesForCurrentDateRangeRef.current.add(
              `${page.page_id}:${page.token}`
            );
          });
        }
      }
    }
  }, [pageChoices, startDayChoice, endDayChoice, prevStartDate, prevEndDate]);

  return (
    <DashboardContent maxWidth="xl">
      <Box>
        <Typography
          sx={{
            flexGrow: 1,
            fontSize: "24px",
            lineHeight: "36px",
            fontWeight: 700,
            fontFamily: "Public Sans Variable",
            color: "#171A1FFF",
          }}
        >
          Dashboard
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          my: 4,
          gap: 3,
        }}
      >
        <Box>
          <DropdownSourceChoice
            value={sourceChoice}
            onChange={setSourceChoice}
          />
        </Box>

        <Box>
          <DropdownPageChoice value={pageChoices} onChange={setPageChoices} />
        </Box>

        <Box>
          <DropdownCalendarChoice
            value={periodChoice}
            onChange={setPeriodChoice}
            onDateRangeChange={(start, end, prevStart, prevEnd) => {
              setStartDayChoice(start);
              setEndDayChoice(end);
              setPrevStartDate(prevStart);
              setPrevEndDate(prevEnd);
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <EcommerceReactionsTotal
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <EcommerceViewsTotal
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <EcommerceCommentsTotal
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <EcommerceSharesTotal
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
            onDashboardDataChange={setDashboardData}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <EcommerceReactionChart
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <EcommerceViewChart
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <EcommerceCommentsChart
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <EcommerceSharesChart
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <EcommercePostsData
            pages={pageChoices}
            dashboardData={dashboardData}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
