"use client";

import { DashboardContent } from "@/layouts/dashboard";

import { EcommerceBestSalesman } from "../ecommerce-best-salesman";
import { EcommerceSalesOverview } from "../ecommerce-sales-overview";
import { EcommerceLatestProducts } from "../ecommerce-latest-products";
// import { EcommerceCurrentBalance } from "../ecommerce-current-balance";
import { AppointmentByTimeChart } from "../appointment-time-chart";
import { AppointmentByChannelChart } from "../appointment-channel-chart";
import { AppointmentByStatusChart } from "../appointment-status-chart";
import { Grid2 as Grid, Typography } from "@mui/material";
import { AnalyticsWidgetSummary } from "../widget-summary";
import { CONFIG } from "@/config-global";
import Image from "next/image";
import {
  useGetAppointmentsCount,
  useGetCustomersCount,
  useGetFBCommentsCount,
  useGetMessagesCount,
} from "@/actions/chart";
import { CustomerByChannelChart } from "../customer-channel-chart";
import { ConversionRateChart } from "../conversion-rate-chart";

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
  const { fbCommentsCount } = useGetFBCommentsCount(new Date().getFullYear());
  const { messagesCount } = useGetMessagesCount(new Date().getMonth() + 1);
  const { appointmentsCount } = useGetAppointmentsCount();

  //customer
  const totalCustomers = customersCount?.reduce(
    (sum, c) => sum + parseInt(c.count || "0"),
    0
  );

  const customerChartData = {
    categories: customersCount?.map(
      (m) => monthsTxt[parseInt(m.created_at_month) - 1]
    ),
    series: customersCount?.map((m) => m.count),
  };

  const currentMonthData = customersCount?.find(
    (m) => parseInt(m.created_at_month) === new Date().getMonth() + 1
  );
  const prevMonthData = customersCount?.find(
    (m) => parseInt(m.created_at_month) === new Date().getMonth()
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
    (m) => parseInt(m.date_created_day) === new Date().getDate()
  );
  const yesterdayData = messagesCount?.find(
    (m) => parseInt(m.date_created_day) === new Date().getDate() - 1
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
  const totalComments = fbCommentsCount?.reduce(
    (sum, c) => sum + parseInt(c.count || "0"),
    0
  );

  const commentsChartData = {
    categories: fbCommentsCount?.map(
      (m) => monthsTxt[parseInt(m.date_created_month) - 1]
    ),
    series: fbCommentsCount?.map((m) => m.count),
  };

  const currentCommentsMonthData = fbCommentsCount?.find(
    (m) => parseInt(m.date_created_month) === new Date().getMonth() + 1
  );
  const prevCommentsMonthData = fbCommentsCount?.find(
    (m) => parseInt(m.date_created_month) === new Date().getMonth()
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
        {fbCommentsCount ? (
          <Grid size={{ xs: 12, md: 3, sm: 6 }}>
            <AnalyticsWidgetSummary
              title="Monthly Comments"
              percent={percentCommentsChange}
              total={totalComments}
              color="info"
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
        ) : (
          <></>
        )}

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppointmentByChannelChart title="Appointments by channel" />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          {/*number of customer */}
          <AppointmentByTimeChart
            title="Appointments by Time"
            chart={{
              series: [
                { name: "Daily", categories: [], data: [] },
                { name: "Weekly", categories: [], data: [] },
                { name: "Monthly", categories: [], data: [] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <CustomerByChannelChart title="Conversations by channel" />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppointmentByStatusChart title="Appointments by status" />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <EcommerceSalesOverview
            title="Sales overview"
            data={_ecommerceSalesOverview}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ConversionRateChart title="Conversion Rate" />
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
