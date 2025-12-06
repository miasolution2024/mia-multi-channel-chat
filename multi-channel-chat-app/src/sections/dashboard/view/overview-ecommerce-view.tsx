/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DashboardContent } from "@/layouts/dashboard";

import { EcommerceYearlySales } from "../ecommerce-yearly-sales";
import { EcommerceBestSalesman } from "../ecommerce-best-salesman";
import { EcommerceSaleByGender } from "../ecommerce-sale-by-gender";
import { EcommerceSalesOverview } from "../ecommerce-sales-overview";
import { EcommerceLatestProducts } from "../ecommerce-latest-products";
import { EcommerceCurrentBalance } from "../ecommerce-current-balance";
import { Grid2 as Grid, Typography } from "@mui/material";
import { AnalyticsWidgetSummary } from "../widget-summary";
import { CONFIG } from "@/config-global";
import Image from "next/image";
import {
  useGetAppointmentsCount,
  useGetCustomersCount,
  useGetConversationsCount,
  useGetMessagesCount,
} from "@/actions/chart";

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
export const monthsTxt = [
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
];
// ----------------------------------------------------------------------

export function OverviewEcommerceView() {
  const { customersCount } = useGetCustomersCount(new Date().getFullYear());
  const { conversationsCount } = useGetConversationsCount(new Date().getFullYear());
  const { messagesCount } = useGetMessagesCount();
  const { appointmentsCount } = useGetAppointmentsCount();

  //customer
  const totalCustomers = customersCount?.reduce(
    (sum, c) => sum + parseInt(c.count || "0"),
    0
  );

  const customerChartData = {
    categories: customersCount?.map((m) => monthsTxt[m.created_at_month - 1]),
    series: customersCount?.map((m) => m.count),
  };

  const currentMonthData = customersCount?.find(
    (m) => m.created_at_month === new Date().getMonth() + 1
  );
  const prevMonthData = customersCount?.find(
    (m) => m.created_at_month === new Date().getMonth()
  );

  const currentMonthCount = currentMonthData
    ? parseInt(currentMonthData.count || "0")
    : 0;
  const prevMonthCount = prevMonthData
    ? parseInt(prevMonthData.count || "0")
    : 0;

  const percentCustomerChange =
    prevMonthCount === 0
      ? 0
      : ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;

  // message
  const totalMessages = messagesCount?.reduce(
    (sum, c) => sum + parseInt(c.count || "0"),
    0
  );

  const messageChartData = {
    categories: messagesCount?.map((m) => m.date_created_day),
    series: messagesCount?.map((m) => m.count),
  };

  const todayData = messagesCount?.find(
    (m) => m.date_created_day === new Date().getDate()
  );
  const yesterdayData = messagesCount?.find(
    (m) => m.date_created_day === new Date().getDate() - 1
  );

  const todayCount = todayData ? parseInt(todayData.count || "0") : 0;
  const yesterdayCount = yesterdayData
    ? parseInt(yesterdayData.count || "0")
    : 0;

  const percentMessageChange =
    yesterdayCount === 0
      ? 0
      : ((todayCount - yesterdayCount) / yesterdayCount) * 100;

  // appointments
  const totalAppointments = appointmentsCount?.reduce(
    (sum, c) => sum + parseInt(c.count || "0"),
    0
  );

  const appointmentsChartData = {
    categories: appointmentsCount?.map((m) => m.status),
    series: appointmentsCount?.map((m) => m.count),
  };

  //comment
  const totalComments = conversationsCount?.reduce(
    (sum, c) => sum + parseInt(c.count || "0"),
    0
  );

  const commentsChartData = {
    categories: conversationsCount?.map(
      (m) => monthsTxt[m.date_created_month - 1]
    ),
    series: conversationsCount?.map((m) => m.count),
  };

  const currentCommentsMonthData = conversationsCount?.find(
    (m) => m.date_created_month === new Date().getMonth() + 1
  );
  const prevCommentsMonthData = conversationsCount?.find(
    (m) => m.date_created_month === new Date().getMonth()
  );

  const currentCommentsMonthCount = currentCommentsMonthData
    ? parseInt(currentCommentsMonthData.count || "0")
    : 0;
  const prevCommentsMonthCount = prevCommentsMonthData
    ? parseInt(prevCommentsMonthData.count || "0")
    : 0;

  const percentCommentsChange =
    prevCommentsMonthCount === 0
      ? 0
      : ((currentCommentsMonthCount - prevCommentsMonthCount) /
        prevCommentsMonthCount) *
      100;

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>
      <Grid container spacing={3}>
        {messagesCount && (
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <AnalyticsWidgetSummary
              title="Daily Messages"
              percent={percentMessageChange}
              total={totalMessages}
              color="error"
              icon={
                <Image
                  width={48}
                  height={48}
                  alt="icon"
                  src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-message.svg`}
                />
              }
              chart={messageChartData}
            />
          </Grid>
        )}
        {customersCount && (
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <AnalyticsWidgetSummary
              title="Monthly Customers"
              percent={percentCustomerChange}
              total={totalCustomers}
              color="secondary"
              icon={
                <Image
                  width={48}
                  height={48}
                  alt="icon"
                  src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-users.svg`}
                />
              }
              chart={customerChartData}
            />
          </Grid>
        )}

        {appointmentsCount && (
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <AnalyticsWidgetSummary
              title="Appointments"
              total={totalAppointments}
              color="warning"
              icon={
                <Image
                  width={48}
                  height={48}
                  alt="icon"
                  src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-buy.svg`}
                />
              }
              chart={appointmentsChartData}
            />
          </Grid>
        )}
        {conversationsCount && (
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <AnalyticsWidgetSummary
              title="Conversations"
              percent={percentCommentsChange}
              total={totalComments}
              color='info'
              icon={
                <Image
                  width={48}
                  height={48}
                  alt="icon"
                  src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-bag.svg`}
                />
              }
              chart={commentsChartData}
            />
          </Grid>
        )}

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
