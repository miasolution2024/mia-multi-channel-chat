/* eslint-disable @typescript-eslint/no-explicit-any */
import { tableRowClasses } from "@mui/material/TableRow";
import { tableCellClasses } from "@mui/material/TableCell";

import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiTableContainer = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      position: "relative",
      scrollbarWidth: "thin",
      scrollbarColor: `${varAlpha(
        theme.vars.palette.text.disabledChannel,
        0.4
      )} ${varAlpha(theme.vars.palette.text.disabledChannel, 0.08)}`,
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTable = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      "--palette-TableCell-border": theme.vars.palette.divider,
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTableRow = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: any) => ({
      [`&.${tableRowClasses.selected}`]: {
        backgroundColor: varAlpha(theme.vars.palette.primary.darkChannel, 0.04),
        "&:hover": {
          backgroundColor: varAlpha(
            theme.vars.palette.primary.darkChannel,
            0.08
          ),
        },
      },
      "&:last-of-type": {
        [`& .${tableCellClasses.root}`]: { borderColor: "transparent" },
      },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTableCell = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { borderBottomStyle: "dashed" },
    head: ({ theme }: any) => ({
      fontSize: 14,
      color: theme.vars.palette.text.secondary,
      fontWeight: theme.typography.fontWeightSemiBold,
      backgroundColor: theme.vars.palette.background.neutral,
    }),
    stickyHeader: ({ theme }: any) => ({
      backgroundColor: theme.vars.palette.background.paper,
      backgroundImage: `linear-gradient(to bottom, ${theme.vars.palette.background.neutral}, ${theme.vars.palette.background.neutral})`,
    }),
    paddingCheckbox: ({ theme }: any) => ({ paddingLeft: theme.spacing(1) }),
  },
};

// ----------------------------------------------------------------------

const MuiTablePagination = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    backIconButtonProps: { size: "small" },
    nextIconButtonProps: { size: "small" },
    slotProps: { select: { name: "table-pagination-select" } },
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { width: "100%" },
    toolbar: { height: 64 },
    actions: { marginRight: 8 },
    select: ({ theme }: any) => ({
      paddingLeft: 8,
      display: "flex",
      alignItems: "center",
      "&:focus": { borderRadius: theme.shape.borderRadius },
    }),
    selectIcon: {
      right: 4,
      width: 16,
      height: 16,
      top: "calc(50% - 8px)",
    },
  },
};

// ----------------------------------------------------------------------

export const table = {
  MuiTable,
  MuiTableRow,
  MuiTableCell,
  MuiTableContainer,
  MuiTablePagination,
};
