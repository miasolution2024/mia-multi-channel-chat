/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
"use client";

import { forwardRef } from "react";

import Box from "@mui/material/Box";

import { StyledLabel } from "./styles";
import { labelClasses } from "./classes";

// ----------------------------------------------------------------------

export const Label = forwardRef(
  (
    {
      children,
      color = "default",
      variant = "soft",
      startIcon,
      endIcon,
      sx,
      className,
      ...other
    }: any,
    ref
  ) => {
    const iconStyles = {
      width: 16,
      height: 16,
      "& svg, img": {
        width: 1,
        height: 1,
        objectFit: "cover",
      },
    };

    return (
      <StyledLabel
        ref={ref}
        component="span"
        className={labelClasses.root.concat(className ? ` ${className}` : "")}
        ownerState={{ color, variant }}
        sx={{
          ...(startIcon && { pl: 0.75 }),
          ...(endIcon && { pr: 0.75 }),
          ...sx,
        }}
        {...other}
      >
        {startIcon && (
          <Box
            component="span"
            className={labelClasses.icon}
            sx={{ mr: 0.75, ...iconStyles }}
          >
            {startIcon}
          </Box>
        )}

        {typeof children === "string" ? sentenceCase(children) : children}

        {endIcon && (
          <Box
            component="span"
            className={labelClasses.icon}
            sx={{ ml: 0.75, ...iconStyles }}
          >
            {endIcon}
          </Box>
        )}
      </StyledLabel>
    );
  }
);

// ----------------------------------------------------------------------

function sentenceCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
