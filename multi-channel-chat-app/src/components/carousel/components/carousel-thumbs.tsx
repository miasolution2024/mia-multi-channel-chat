/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { Children, forwardRef, isValidElement } from "react";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";

import { carouselClasses } from "../classes";
import { CarouselSlide } from "./carousel-slide";
import { StyledRoot, StyledContainer } from "../carousel";
import { varAlpha } from "@/theme/styles";

// ----------------------------------------------------------------------

export const CarouselThumbs = forwardRef(
  ({ children, slotProps, options, sx, className, ...other }: any, ref) => {
    const axis = options?.axis ?? "x";

    const slideSpacing = options?.slideSpacing ?? "12px";

    const maskStyles = useMaskStyle(axis);

    const renderChildren = Children.map(children, (child) => {
      if (isValidElement(child)) {
        const reactChild = child;

        return (
          <CarouselSlide
            key={reactChild.key}
            options={{ ...options, slideSpacing }}
            sx={slotProps?.slide}
          >
            {child}
          </CarouselSlide>
        );
      }
      return null;
    });

    return (
      <StyledRoot
        ref={ref}
        axis={axis}
        className={carouselClasses.thumbs.concat(
          className ? ` ${className}` : ""
        )}
        sx={{
          flexShrink: 0,
          ...(axis === "x" && { p: 0.5, maxWidth: 1 }),
          ...(axis === "y" && { p: 0.5, maxHeight: 1 }),
          ...(!slotProps?.disableMask && maskStyles),
          ...sx,
        }}
        {...other}
      >
        <StyledContainer
          // component="ul"
          // axis={axis}
          // slideSpacing={slideSpacing}
          className={carouselClasses.thumbContainer}
          sx={{
            ...slotProps?.container,
          }}
        >
          {renderChildren}
        </StyledContainer>
      </StyledRoot>
    );
  }
);

// ----------------------------------------------------------------------

export function CarouselThumb({
  sx,
  src,
  index,
  selected,
  className,
  ...other
}: any) {
  return (
    <ButtonBase
      className={carouselClasses.thumb.concat(className ? ` ${className}` : "")}
      sx={{
        width: 64,
        height: 64,
        opacity: 0.48,
        flexShrink: 0,
        cursor: "pointer",
        borderRadius: 1.25,
        transition: (theme) =>
          theme.transitions.create(["opacity", "box-shadow"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.short,
          }),
        ...(selected && {
          opacity: 1,
          boxShadow: (theme: any) =>
            `0 0 0 2px ${theme.vars.palette.primary.main}`,
        }),
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt={`carousel-thumb-${index}`}
        src={src}
        className={carouselClasses.thumbImage}
        sx={{
          width: 1,
          height: 1,
          objectFit: "cover",
          borderRadius: "inherit",
        }}
      />
    </ButtonBase>
  );
}

// ----------------------------------------------------------------------

function useMaskStyle(axis: any) {
  const theme = useTheme() as any;

  const baseStyles = {
    zIndex: 9,
    content: '""',
    position: "absolute",
  };

  const bgcolor = `${theme.vars.palette.background.paper} 20%, ${varAlpha(
    theme.vars.palette.background.paperChannel,
    0
  )} 100%)`;

  if (axis === "y") {
    return {
      "&::before, &::after": {
        ...baseStyles,
        left: 0,
        height: 40,
        width: "100%",
      },
      "&::before": {
        top: -8,
        background: `linear-gradient(to bottom, ${bgcolor}`,
      },
      "&::after": {
        bottom: -8,
        background: `linear-gradient(to top, ${bgcolor}`,
      },
    };
  }

  return {
    "&::before, &::after": {
      ...baseStyles,
      top: 0,
      width: 40,
      height: "100%",
    },
    "&::before": {
      left: -8,
      background: `linear-gradient(to right, ${bgcolor}`,
    },
    "&::after": {
      right: -8,
      background: `linear-gradient(to left, ${bgcolor}`,
    },
  };
}
