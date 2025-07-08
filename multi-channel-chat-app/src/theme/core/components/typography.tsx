/* eslint-disable @typescript-eslint/no-explicit-any */
// ----------------------------------------------------------------------

const MuiTypography = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paragraph: ({ theme }: any) => ({ marginBottom: theme.spacing(2) }),
    gutterBottom: ({ theme }: any) => ({ marginBottom: theme.spacing(1) }),
  },
};

// ----------------------------------------------------------------------

export const typography = { MuiTypography };
