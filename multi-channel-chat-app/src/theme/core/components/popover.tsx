/* eslint-disable @typescript-eslint/no-explicit-any */
import { listClasses } from "@mui/material/List";

import { paper } from "../../styles";

// ----------------------------------------------------------------------

const MuiPopover = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paper: ({ theme }: any) => ({
      ...paper({ theme, dropdown: true }),
      [`& .${listClasses.root}`]: { paddingTop: 0, paddingBottom: 0 },
    }),
  },
};

// ----------------------------------------------------------------------

export const popover = { MuiPopover };
