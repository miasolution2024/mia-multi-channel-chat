/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { forwardRef } from "react";
import SimpleBar from "simplebar-react";

import Box from "@mui/material/Box";

import { scrollbarClasses } from "./classes";

// ----------------------------------------------------------------------

export const Scrollbar = forwardRef(
  ({ slotProps, children, fillContent, sx, ...other }: any, ref) => (
    <Box
      component={SimpleBar}
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      className={scrollbarClasses.root}
      sx={{
        minWidth: 0,
        minHeight: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        "& .simplebar-wrapper": slotProps?.wrapper,
        "& .simplebar-content-wrapper": slotProps?.contentWrapper,
        "& .simplebar-content": {
          ...(fillContent && {
            minHeight: 1,
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
          }),

          ...slotProps?.content,
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  )
);
