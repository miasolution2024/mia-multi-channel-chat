/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { carouselClasses } from "../classes";
import { varAlpha } from "@/theme/styles";

// ----------------------------------------------------------------------

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: 6,
  maxWidth: 120,
  width: "100%",
  borderRadius: 6,
  overflow: "hidden",
  position: "relative",
  color: theme.vars.palette.text.primary,
  backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.2),
}));

const StyledProgress = styled(Box)(() => ({
  top: 0,
  bottom: 0,
  width: "100%",
  left: "-100%",
  position: "absolute",
  backgroundColor: "currentColor",
}));

// ----------------------------------------------------------------------

export function CarouselProgressBar({ sx, value, className, ...other }: any) {
  return (
    <StyledRoot
      sx={sx}
      className={carouselClasses.progress.concat(
        className ? ` ${className}` : ""
      )}
      {...other}
    >
      <StyledProgress
        className={carouselClasses.progressBar}
        sx={{
          transform: `translate3d(${value}%, 0px, 0px)`,
        }}
      />
    </StyledRoot>
  );
}
