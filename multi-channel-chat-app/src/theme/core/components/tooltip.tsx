/* eslint-disable @typescript-eslint/no-explicit-any */
import { tooltipClasses } from "@mui/material/Tooltip";

import { stylesMode } from "../../styles";

// ----------------------------------------------------------------------

const MuiTooltip = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    tooltip: ({ theme }: any) => ({
      backgroundColor: theme.vars.palette.grey[800],
      [stylesMode.dark]: {
        backgroundColor: theme.vars.palette.grey[700],
      },
    }),
    arrow: ({ theme }: any) => ({
      color: theme.vars.palette.grey[800],
      [stylesMode.dark]: {
        color: theme.vars.palette.grey[700],
      },
    }),
    popper: {
      [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
        {
          marginTop: 12,
        },
      [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
        {
          marginBottom: 12,
        },
      [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
        {
          marginLeft: 12,
        },
      [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
        {
          marginRight: 12,
        },
    },
  },
};

// ----------------------------------------------------------------------

export const tooltip = { MuiTooltip };
