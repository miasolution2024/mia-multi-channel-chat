"use client";

import { DashboardContent } from "@/layouts/dashboard";

import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { useState } from "react";
import DropdownSourceChoice from "../components/dropdown-source-choice";
import DropdownPageChoice from "../components/dropdown-page-choice";
import DropdownCalendarChoice from "../components/dropdown-calendar-choice";
import EcommerceViewTotal from "../ecommerce-view-total";
import { OmniChoices } from "../type";
import EcommerceReactionTotal from "../ecommerce-reaction-total";
import EcommerceViewChart from "../ecommerce-view-chart";
import EcommerceReactionChart from "../ecommerce-reaction-chart";
import EcommercePagesData from "../ecommerce-pages-data";

// ECOMMERCE
// ----------------------------------------------------------------------

export const _ecommerceSalesOverview = [
  "Total profit",
  "Total income",
  "Total expenses",
].map((label) => ({
  label,
  totalAmount: 1,
  value: 10,
}));

export const _ecommerceBestSalesman = [...Array(5)].map((_, index) => {
  const category = [
    "CAP",
    "Branded shoes",
    "Headphone",
    "Cell phone",
    "Earings",
  ][index];

  return {
    id: index,
    category,
    rank: `Top ${index + 1}`,
    email: "email 1",
    name: "name 1",
    totalAmount: 12,
    avatarUrl: "avatar 1",
    countryCode: ["de", "gb", "fr", "kr", "us"][index],
  };
});

export const _ecommerceLatestProducts = [...Array(5)].map((_, index) => {
  const colors = (index === 0 && [
    "#2EC4B6",
    "#E71D36",
    "#FF9F1C",
    "#011627",
  ]) ||
    (index === 1 && ["#92140C", "#FFCF99"]) ||
    (index === 2 && [
      "#0CECDD",
      "#FFF338",
      "#FF67E7",
      "#C400FF",
      "#52006A",
      "#046582",
    ]) ||
    (index === 3 && ["#845EC2", "#E4007C", "#2A1A5E"]) || ["#090088"];

  return {
    id: index,
    colors,
    name: "product name 1",
    price: 123,
    coverUrl: "cover 1",
    priceSale: 12,
  };
});

export const _ecommerceNewProducts = [...Array(4)].map((_, index) => ({
  id: index,
  name: "new product 1",
  coverUrl: "12312",
}));

// ----------------------------------------------------------------------

export function OverviewEcommerceView() {
  // const theme = useTheme() as any;

  // const { user } = useAuthContext();
  const [sourceChoice, setSourceChoice] = useState("Facebook");
  const [pageChoices, setPageChoices] = useState<OmniChoices[]>([]);
  const [startDayChoice, setStartDayChoice] = useState<string>("");
  const [endDayChoice, setEndDayChoice] = useState<string>("");
  const [periodChoice, setPeriodChoice] = useState("");

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
            onDateRangeChange={(start, end) => {
              setStartDayChoice(start);
              setEndDayChoice(end);
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <EcommerceReactionTotal
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
            period={periodChoice}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <EcommerceViewTotal
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
            period={periodChoice}
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
          <EcommerceReactionChart
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <EcommercePagesData
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
            period={periodChoice}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
