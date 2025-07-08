/* eslint-disable @typescript-eslint/no-explicit-any */
import { menuItem } from "../../styles";

// ----------------------------------------------------------------------

const MuiMenuItem = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }: any) => ({ ...menuItem(theme) }) },
};

// ----------------------------------------------------------------------

export const menu = { MuiMenuItem };
