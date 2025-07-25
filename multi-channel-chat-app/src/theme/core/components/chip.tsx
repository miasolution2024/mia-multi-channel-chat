/* eslint-disable @typescript-eslint/no-explicit-any */
import SvgIcon from "@mui/material/SvgIcon";
import { chipClasses } from "@mui/material/Chip";

import { varAlpha, stylesMode } from "../../styles";

// ----------------------------------------------------------------------

/**
 * Icons
 * https://icon-sets.iconify.design/solar/close-circle-bold
 */
export const ChipDeleteIcon = (props: any) => (
  <SvgIcon {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 0 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06"
      clipRule="evenodd"
    />
  </SvgIcon>
);

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"];

// ----------------------------------------------------------------------

function styleColors(ownerState: any, styles: any) {
  const outputStyle = COLORS.reduce((acc, color) => {
    if (!ownerState.disabled && ownerState.color === color) {
      acc = styles(color);
    }
    return acc;
  }, {});

  return outputStyle;
}

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
  inheritColor: [
    {
      props: ({ ownerState }: any) =>
        ownerState.variant === "soft" && ownerState.color === "default",
      style: ({ theme }: any) => ({
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
        "&:hover": {
          backgroundColor: varAlpha(
            theme.vars.palette.grey["500Channel"],
            0.32
          ),
        },
      }),
    },
  ],
};

// ----------------------------------------------------------------------

const MuiChip = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { deleteIcon: <ChipDeleteIcon /> },

  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [
    /**
     * @variant soft
     */
    ...[...softVariant.inheritColor, ...softVariant.colors],
  ],

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ ownerState, theme }: any) => {
      const styled = {
        colors: styleColors(ownerState, (color: any) => ({
          [`& .${chipClasses.avatar}`]: {
            color: theme.vars.palette[color].lighter,
            backgroundColor: theme.vars.palette[color].dark,
          },
        })),
        disabled: {
          [`&.${chipClasses.disabled}`]: {
            opacity: 1,
            [`& .${chipClasses.avatar}`]: {
              color: theme.vars.palette.action.disabled,
              backgroundColor: theme.vars.palette.action.disabledBackground,
            },
            ...(ownerState.variant === "outlined" && {
              color: theme.vars.palette.action.disabled,
              borderColor: theme.vars.palette.action.disabledBackground,
            }),
            ...(["filled", "soft"].includes(ownerState.variant) && {
              color: theme.vars.palette.action.disabled,
              backgroundColor: theme.vars.palette.action.disabledBackground,
            }),
          },
        },
      };

      return { ...styled.colors, ...styled.disabled };
    },
    label: ({ theme }: any) => ({
      fontWeight: theme.typography.fontWeightMedium,
    }),
    icon: { color: "currentColor" },
    deleteIcon: {
      opacity: 0.48,
      color: "currentColor",
      "&:hover": { opacity: 1, color: "currentColor" },
    },
    sizeMedium: ({ theme }: any) => ({
      borderRadius: theme.shape.borderRadius * 1.25,
    }),
    sizeSmall: ({ theme }: any) => ({ borderRadius: theme.shape.borderRadius }),
    /**
     * @variant filled
     */
    filled: ({ ownerState, theme }: any) => {
      const styled = {
        defaultColor: {
          ...(!ownerState.disabled &&
            ownerState.color === "default" && {
              color: theme.vars.palette.common.white,
              backgroundColor: theme.vars.palette.text.primary,
              [`& .${chipClasses.avatar}`]: {
                color: theme.vars.palette.text.primary,
              },
              "&:hover": { backgroundColor: theme.vars.palette.grey[700] },
              [stylesMode.dark]: {
                color: theme.vars.palette.grey[800],
                "&:hover": { backgroundColor: theme.vars.palette.grey[100] },
              },
            }),
        },
      };
      return { ...styled.defaultColor };
    },
    /**
     * @variant outlined
     */
    outlined: ({ ownerState, theme }: any) => {
      const styled = {
        defaultColor: {
          ...(!ownerState.disabled &&
            ownerState.color === "default" && {
              borderColor: varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.32
              ),
            }),
        },
      };
      return { ...styled.defaultColor };
    },
  },
};

// ----------------------------------------------------------------------

export const chip = { MuiChip };
