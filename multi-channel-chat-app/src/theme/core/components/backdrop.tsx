/* eslint-disable @typescript-eslint/no-explicit-any */
import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiBackdrop = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey["800Channel"], 0.48),
    }),
    invisible: { background: "transparent" },
  },
};

// ----------------------------------------------------------------------

export const backdrop = { MuiBackdrop };
