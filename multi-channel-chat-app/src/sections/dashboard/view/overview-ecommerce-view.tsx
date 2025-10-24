/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

import { DashboardContent } from "@/layouts/dashboard";

// import { EcommerceWelcome } from "../ecommerce-welcome";
// import { EcommerceNewProducts } from "../ecommerce-new-products";
import { EcommerceYearlySales } from "../ecommerce-yearly-sales";
import { EcommerceBestSalesman } from "../ecommerce-best-salesman";
import { EcommerceSaleByGender } from "../ecommerce-sale-by-gender";
import { EcommerceSalesOverview } from "../ecommerce-sales-overview";
import { EcommerceWidgetSummary } from "../ecommerce-widget-summary";
import { EcommerceLatestProducts } from "../ecommerce-latest-products";
import { EcommerceCurrentBalance } from "../ecommerce-current-balance";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
// import { useAuthContext } from "@/auth/hooks/use-auth-context";
// import { MotivationIllustration } from "@/assets/illustrations";
import { useState } from "react";
import DropdownSourceChoice from "../components/dropdown-source-choice";
import DropdownPageChoice from "../components/dropdown-page-choice";
import DropdownCalendarChoice from "../components/dropdown-calendar-choice";
import EcommerceViewTotal from "../ecommerce-view-total";
import { OmniChoices } from "../type";
import EcommerceReactionTotal from "../ecommerce-reaction-total";

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
  const theme = useTheme() as any;

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
          <EcommerceViewTotal
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
            period={periodChoice}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <EcommerceReactionTotal
            pages={pageChoices}
            startDate={startDayChoice}
            endDate={endDayChoice}
            period={periodChoice}
          />
        </Grid>
        {/*<Grid size={{ xs: 12, md: 2.4 }}>
          <EcommerceViewTotal
            startDate={startDayChoice}
            endDate={endDayChoice}
            period={periodChoice}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <EcommerceViewTotal
            startDate={startDayChoice}
            endDate={endDayChoice}
            period={periodChoice}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <EcommerceViewTotal
            startDate={startDayChoice}
            endDate={endDayChoice}
            period={periodChoice}
          />
        </Grid> */}

        {/* <Grid size={{ xs: 12, md: 8 }}>
          <EcommerceWelcome
            title={`Congratulations 🎉  \n ${user?.full_name}`}
            description="Best seller of the month you have done 57.6% more sales today."
            img={<MotivationIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go nowsrggdrersyer
              </Button>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceNewProducts list={_ecommerceNewProducts} />
        </Grid> */}

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Product sold"
            percent={2.6}
            total={765}
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Total balance"
            percent={-0.1}
            total={18765}
            chart={{
              colors: [
                theme.vars.palette.warning.light,
                theme.vars.palette.warning.main,
              ],
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceWidgetSummary
            title="Sales profit"
            percent={0.6}
            total={4876}
            chart={{
              colors: [
                theme.vars.palette.error.light,
                theme.vars.palette.error.main,
              ],
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceSaleByGender
            title="Sale by gender"
            total={2324}
            chart={{
              series: [
                { label: "Mens", value: 25 },
                { label: "Womens", value: 50 },
                { label: "Kids", value: 75 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <EcommerceYearlySales
            title="Yearly sales"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              series: [
                {
                  name: "2022",
                  data: [
                    {
                      name: "Total income",
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: "Total expenses",
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  name: "2023",
                  data: [
                    {
                      name: "Total income",
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: "Total expenses",
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <EcommerceSalesOverview
            title="Sales overview"
            data={_ecommerceSalesOverview}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceCurrentBalance
            title="Current balance"
            earning={25500}
            refunded={1600}
            orderTotal={287650}
            currentBalance={187650}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <EcommerceBestSalesman
            title="Best salesman"
            tableData={_ecommerceBestSalesman}
            headLabel={[
              { id: "name", label: "Seller" },
              { id: "category", label: "Product" },
              { id: "country", label: "Country", align: "center" },
              { id: "totalAmount", label: "Total", align: "right" },
              { id: "rank", label: "Rank", align: "right" },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceLatestProducts
            title="Latest products"
            list={_ecommerceLatestProducts}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
