/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";

import { chartClasses } from "./classes";
import { ChartLoading } from "./chart-loading";
import { withLoadingProps } from "@/utils/with-loading-props";

// ----------------------------------------------------------------------

const ApexChart = withLoadingProps((props: any) =>
  dynamic(() => import("react-apexcharts").then((mod) => mod.default), {
    ssr: false,
    loading: () => {
      const { loading, type } = props();

      return loading?.disabled ? null : (
        <ChartLoading type={type} sx={loading?.sx} />
      );
    },
  })
);

export function Chart({
  sx,
  type,
  series,
  height,
  options,
  className,
  loadingProps,
  width = "100%",
  ...other
}: any) {
  return (
    <Box
      dir="ltr"
      className={chartClasses.root.concat(className ? ` ${className}` : "")}
      sx={{
        width,
        height,
        flexShrink: 0,
        borderRadius: 1.5,
        position: "relative",
        ...sx,
      }}
      {...other}
    >
      <ApexChart
        type={type}
        series={series}
        options={options}
        width="100%"
        height="100%"
        loading={loadingProps}
      />
    </Box>
  );
}
