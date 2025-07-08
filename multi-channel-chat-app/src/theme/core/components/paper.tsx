/* eslint-disable @typescript-eslint/no-explicit-any */
import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiPaper = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { elevation: 0 },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { backgroundImage: "none" },
    outlined: ({ theme }: any) => ({
      borderColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
    }),
  },
};

// ----------------------------------------------------------------------

export const paper = { MuiPaper };
