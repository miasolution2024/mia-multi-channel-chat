/* eslint-disable @typescript-eslint/no-explicit-any */
// ----------------------------------------------------------------------

const MuiTreeItem = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    label: ({ theme }: any) => ({ ...theme.typography.body2 }),
    iconContainer: { width: "auto" },
  },
};

// ----------------------------------------------------------------------

export const treeView = { MuiTreeItem };
