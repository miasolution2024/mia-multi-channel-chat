/* eslint-disable @typescript-eslint/no-explicit-any */
import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiSkeleton = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { animation: "wave", variant: "rounded" },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey["400Channel"], 0.12),
    }),
    rounded: ({ theme }: any) => ({
      borderRadius: theme.shape.borderRadius * 2,
    }),
  },
};

// ----------------------------------------------------------------------

export const skeleton = { MuiSkeleton };
