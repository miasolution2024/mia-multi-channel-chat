/* eslint-disable @typescript-eslint/no-explicit-any */
// ----------------------------------------------------------------------

const MuiBreadcrumbs = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    ol: ({ theme }: any) => ({
      rowGap: theme.spacing(0.5),
      columnGap: theme.spacing(2),
    }),

    li: ({ theme }: any) => ({
      display: "inline-flex",
      "& > *": { ...theme.typography.body2 },
    }),
    separator: { margin: 0 },
  },
};

// ----------------------------------------------------------------------

export const breadcrumbs = { MuiBreadcrumbs };
