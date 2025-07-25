/* eslint-disable @typescript-eslint/no-explicit-any */
import { inputBaseClasses } from "@mui/material/InputBase";
import { filledInputClasses } from "@mui/material/FilledInput";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiInputBase = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      [`&.${inputBaseClasses.disabled}`]: {
        "& svg": { color: theme.vars.palette.text.disabled },
      },
      [`& .${inputBaseClasses.input}:focus`]: {
        borderRadius: "inherit",
      },
    }),
    input: ({ theme }: any) => ({
      fontSize: theme.typography.pxToRem(15),
      [theme.breakpoints.down("sm")]: {
        // This will prevent zoom in Safari min font size ~ 16px
        fontSize: theme.typography.pxToRem(16),
      },
      "&::placeholder": {
        opacity: 1,
        color: theme.vars.palette.text.disabled,
      },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiInput = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    underline: ({ theme }: any) => ({
      "&::before": {
        borderBottomColor: varAlpha(
          theme.vars.palette.grey["500Channel"],
          0.32
        ),
      },
      "&::after": { borderBottomColor: theme.vars.palette.text.primary },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiOutlinedInput = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      [`&.${outlinedInputClasses.focused}`]: {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.vars.palette.text.primary,
        },
      },
      [`&.${outlinedInputClasses.error}`]: {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.vars.palette.error.main,
        },
      },
      [`&.${outlinedInputClasses.disabled}`]: {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.vars.palette.action.disabledBackground,
        },
      },
    }),
    notchedOutline: ({ theme }: any) => ({
      borderColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.2),
      transition: theme.transitions.create(["border-color"], {
        duration: theme.transitions.duration.shortest,
      }),
    }),
  },
};

// ----------------------------------------------------------------------

const MuiFilledInput = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { disableUnderline: true },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      borderRadius: theme.shape.borderRadius,
      backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
      "&:hover": {
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
      },
      [`&.${filledInputClasses.focused}`]: {
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
      },
      [`&.${filledInputClasses.error}`]: {
        backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
        [`&.${filledInputClasses.focused}`]: {
          backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
        },
      },
      [`&.${filledInputClasses.disabled}`]: {
        backgroundColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const textfield = {
  MuiInput,
  MuiInputBase,
  MuiFilledInput,
  MuiOutlinedInput,
};
