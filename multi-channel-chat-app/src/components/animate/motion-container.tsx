/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { m } from "framer-motion";
import { forwardRef } from "react";

import Box from "@mui/material/Box";

import { varContainer } from "./variants";

export const MotionContainer = forwardRef(
  ({ animate, action = false, children, ...other }: any, ref) => {
    const commonProps = {
      ref,
      component: m.div,
      variants: varContainer(),
      initial: action ? false : "initial",
      animate: action ? (animate ? "animate" : "exit") : "animate",
      exit: action ? undefined : "exit",
      ...other,
    };

    return <Box {...commonProps}>{children}</Box>;
  }
);
