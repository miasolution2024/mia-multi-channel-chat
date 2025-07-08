/* eslint-disable @typescript-eslint/no-explicit-any */
// ----------------------------------------------------------------------

const MuiStepConnector = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    line: ({ theme }: any) => ({ borderColor: theme.vars.palette.divider }),
  },
};

// ----------------------------------------------------------------------

export const stepper = { MuiStepConnector };
