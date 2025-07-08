/* eslint-disable @typescript-eslint/no-explicit-any */
import { badgeClasses } from "@mui/material/Badge";

// ----------------------------------------------------------------------

const baseStyles = (theme: any) => ({
  width: 10,
  zIndex: 9,
  padding: 0,
  height: 10,
  minWidth: "auto",
  "&::before, &::after": {
    content: "''",
    borderRadius: 1,
    backgroundColor: theme.vars.palette.common.white,
  },
  [`&.${badgeClasses.invisible}`]: { transform: "unset" },
});

const MuiBadge = {
  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [
    /**
     * @variant online
     */
    {
      props: ({ ownerState }: any) => ownerState.variant === "online",
      style: ({ theme }: any) => ({
        [`& .${badgeClasses.badge}`]: {
          ...baseStyles(theme),
          backgroundColor: theme.vars.palette.success.main,
        },
      }),
    },
    /**
     * @variant alway
     */
    {
      props: ({ ownerState }: any) => ownerState.variant === "alway",
      style: ({ theme }: any) => ({
        [`& .${badgeClasses.badge}`]: {
          ...baseStyles(theme),
          backgroundColor: theme.vars.palette.warning.main,
          "&::before": {
            width: 2,
            height: 4,
            transform: "translateX(1px) translateY(-1px)",
          },
          "&::after": {
            width: 2,
            height: 4,
            transform: "translateY(1px) rotate(125deg)",
          },
        },
      }),
    },
    /**
     * @variant busy
     */
    {
      props: ({ ownerState }: any) => ownerState.variant === "busy",
      style: ({ theme }: any) => ({
        [`& .${badgeClasses.badge}`]: {
          ...baseStyles(theme),
          backgroundColor: theme.vars.palette.error.main,
          "&::before": { width: 6, height: 2 },
        },
      }),
    },
    /**
     * @variant offline
     */
    {
      props: ({ ownerState }: any) => ownerState.variant === "offline",
      style: ({ theme }: any) => ({
        [`& .${badgeClasses.badge}`]: {
          ...baseStyles(theme),
          backgroundColor: theme.vars.palette.text.disabled,
          "&::before": { width: 6, height: 6, borderRadius: "50%" },
        },
      }),
    },
    /**
     * @variant invisible
     */
    {
      props: ({ ownerState }: any) => ownerState.variant === "invisible",
      style: { [`& .${badgeClasses.badge}`]: { display: "none" } },
    },
  ],

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { dot: { borderRadius: "50%" } },
};

// ----------------------------------------------------------------------

export const badge = { MuiBadge };
