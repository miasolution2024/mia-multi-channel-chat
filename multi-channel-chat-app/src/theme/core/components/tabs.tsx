/* eslint-disable @typescript-eslint/no-explicit-any */
import { tabClasses } from "@mui/material/Tab";

// ----------------------------------------------------------------------

const MuiTabs = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    textColor: "inherit",
    variant: "scrollable",
    allowScrollButtonsMobile: true,
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    flexContainer: ({ ownerState, theme }: any) => ({
      ...(ownerState.variant !== "fullWidth" && {
        gap: "24px",
        [theme.breakpoints.up("sm")]: {
          gap: "40px",
        },
      }),
    }),
    indicator: { backgroundColor: "currentColor" },
  },
};

// ----------------------------------------------------------------------

const MuiTab = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { disableRipple: true, iconPosition: "start" },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      opacity: 1,
      minWidth: 48,
      minHeight: 48,
      padding: theme.spacing(1, 0),
      //color: theme.vars.palette.text.secondary,
      fontWeight: theme.typography.fontWeightMedium,
      lineHeight: theme.typography.body2.lineHeight,
      [`&.${tabClasses.selected}`]: {
        color: theme.vars.palette.text.primary,
        fontWeight: theme.typography.fontWeightSemiBold,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const tabs = { MuiTabs, MuiTab };
