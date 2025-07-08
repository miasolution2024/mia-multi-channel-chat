/* eslint-disable @typescript-eslint/no-explicit-any */
// ----------------------------------------------------------------------

const MuiTimelineDot = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: { boxShadow: "none" } },
};

const MuiTimelineConnector = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({ backgroundColor: theme.vars.palette.divider }),
  },
};

// ----------------------------------------------------------------------

export const timeline = { MuiTimelineDot, MuiTimelineConnector };
