/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ----------------------------------------------------------------------

export function useResponsive(query: string, start: any, end?: any) {
  const theme = useTheme();

  const getQuery = useMemo(() => {
    switch (query) {
      case "up":
        return theme.breakpoints.up(start);
      case "down":
        return theme.breakpoints.down(start);
      case "between":
        return theme.breakpoints.between(start, end);
      case "only":
        return theme.breakpoints.only(start);
      default:
        return theme.breakpoints.up("xs");
    }
  }, [theme, query, start, end]);

  const mediaQueryResult = useMediaQuery(getQuery);

  return mediaQueryResult;
}

// ----------------------------------------------------------------------

export function useWidth() {
  const theme = useTheme();

  const keys = useMemo(() => [...theme.breakpoints.keys].reverse(), [theme]);

  const width = keys.reduce((output: any, key: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const matches = useMediaQuery(theme.breakpoints.up(key));

    return !output && matches ? key : output;
  }, null);

  return width || "xs";
}
