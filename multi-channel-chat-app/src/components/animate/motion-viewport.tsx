/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { m } from "framer-motion";
import { forwardRef } from "react";

import Box from "@mui/material/Box";

import { varContainer } from "./variants";
import { useResponsive } from "@/hooks/use-responsive";

export const MotionViewport = forwardRef(
  ({ children, disableAnimate = true, ...other }: any, ref) => {
    const smDown = useResponsive("down", "sm");

    const disabled = smDown && disableAnimate;

    const props = disabled
      ? {}
      : {
          component: m.div,
          initial: "initial",
          whileInView: "animate",
          variants: varContainer(),
          viewport: { once: true, amount: 0.3 },
        };

    return (
      <Box ref={ref} {...props} {...other}>
        {children}
      </Box>
    );
  }
);
