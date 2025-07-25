/* eslint-disable @typescript-eslint/no-explicit-any */
import { buttonClasses } from "@mui/material/Button";

import { varAlpha, stylesMode } from "../../styles";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"];

function styleColors(ownerState: any, styles: any) {
  const outputStyle = COLORS.reduce((acc, color) => {
    if (!ownerState.disabled && ownerState.color === color) {
      acc = styles(color);
    }
    return acc;
  }, {});

  return outputStyle;
}

// ----------------------------------------------------------------------

const MuiButtonBase = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({ fontFamily: theme.typography.fontFamily }),
  },
};

// ----------------------------------------------------------------------

const softVariant = {
  colors: COLORS.map((color) => ({
    props: ({ ownerState }: any) =>
      !ownerState.disabled &&
      ownerState.variant === "soft" &&
      ownerState.color === color,
    style: ({ theme }: any) => ({
      color: theme.vars.palette[color].dark,
      backgroundColor: varAlpha(theme.vars.palette[color].mainChannel, 0.16),
      "&:hover": {
        backgroundColor: varAlpha(theme.vars.palette[color].mainChannel, 0.32),
      },
      [stylesMode.dark]: { color: theme.vars.palette[color].light },
    }),
  })),
  base: [
    {
      props: ({ ownerState }: any) => ownerState.variant === "soft",
      style: ({ theme }: any) => ({
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        "&:hover": {
          backgroundColor: varAlpha(
            theme.vars.palette.grey["500Channel"],
            0.24
          ),
        },
        [`&.${buttonClasses.disabled}`]: {
          backgroundColor: theme.vars.palette.action.disabledBackground,
        },
        // [`& .${loadingButtonClasses.loadingIndicatorStart}`]: { left: 14 },
        // [`& .${loadingButtonClasses.loadingIndicatorEnd}`]: { right: 14 },
        [`&.${buttonClasses.sizeSmall}`]: {
          // [`& .${loadingButtonClasses.loadingIndicatorStart}`]: { left: 10 },
          // [`& .${loadingButtonClasses.loadingIndicatorEnd}`]: { right: 10 },
        },
      }),
    },
  ],
};

const MuiButton = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { color: "inherit", disableElevation: true },

  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [
    /**
     * @variant soft
     */
    ...[...softVariant.base, ...softVariant.colors],
  ],

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    /**
     * @variant contained
     */
    contained: ({ theme, ownerState }: any) => {
      const styled = {
        colors: styleColors(ownerState, (color: any) => ({
          "&:hover": { boxShadow: theme.customShadows[color] },
        })),
        inheritColor: {
          ...(ownerState.color === "inherit" &&
            !ownerState.disabled && {
              color: theme.vars.palette.common.white,
              backgroundColor: theme.vars.palette.grey[800],
              "&:hover": {
                boxShadow: theme.customShadows.z8,
                backgroundColor: theme.vars.palette.grey[700],
              },
              [stylesMode.dark]: {
                color: theme.vars.palette.grey[800],
                backgroundColor: theme.vars.palette.common.white,
                "&:hover": { backgroundColor: theme.vars.palette.grey[400] },
              },
            }),
        },
      };
      return { ...styled.inheritColor, ...styled.colors };
    },
    /**
     * @variant outlined
     */
    outlined: ({ theme, ownerState }: any) => {
      const styled = {
        colors: styleColors(ownerState, (color: any) => ({
          borderColor: varAlpha(theme.vars.palette[color].mainChannel, 0.48),
        })),
        inheritColor: {
          ...(ownerState.color === "inherit" &&
            !ownerState.disabled && {
              borderColor: varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.32
              ),
              "&:hover": { backgroundColor: theme.vars.palette.action.hover },
            }),
        },
        base: {
          "&:hover": {
            borderColor: "currentColor",
            boxShadow: "0 0 0 0.75px currentColor",
          },
        },
      };
      return { ...styled.base, ...styled.inheritColor, ...styled.colors };
    },
    /**
     * @variant text
     */
    text: ({ ownerState, theme }: any) => {
      const styled = {
        inheritColor: {
          ...(ownerState.color === "inherit" &&
            !ownerState.disabled && {
              "&:hover": { backgroundColor: theme.vars.palette.action.hover },
            }),
        },
      };
      return { ...styled.inheritColor };
    },
    /**
     * @size
     */
    sizeSmall: ({ ownerState }: any) => ({
      height: 30,
      ...(ownerState.variant === "text"
        ? { paddingLeft: "4px", paddingRight: "4px" }
        : { paddingLeft: "8px", paddingRight: "8px" }),
    }),
    sizeMedium: ({ ownerState }: any) => ({
      ...(ownerState.variant === "text"
        ? { paddingLeft: "8px", paddingRight: "8px" }
        : { paddingLeft: "12px", paddingRight: "12px" }),
    }),
    sizeLarge: ({ ownerState }: any) => ({
      height: 48,
      ...(ownerState.variant === "text"
        ? { paddingLeft: "10px", paddingRight: "10px" }
        : { paddingLeft: "16px", paddingRight: "16px" }),
    }),
  },
};

// ----------------------------------------------------------------------

export const button = { MuiButtonBase, MuiButton };
