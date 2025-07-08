/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";

import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formHelperTextClasses } from "@mui/material/FormHelperText";

import { Iconify } from "@/components/iconify";
import { usePopover, CustomPopover } from "@/components/custom-popover";
import { FilterSalesOrderState } from "./view/order-list-view";
// ----------------------------------------------------------------------
type SalesOrderToolbarProps = {
  filters: {
    state: FilterSalesOrderState;
    setState: (updateState: Partial<FilterSalesOrderState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  dateError: boolean;
  onResetPage: () => void;
};

// ----------------------------------------------------------------------

export function OrderTableToolbar({
  filters,
  onResetPage,
  dateError,
}: SalesOrderToolbarProps) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ customerName: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterStartDate = useCallback(
    (newValue: any) => {
      onResetPage();
      filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue: any) => {
      onResetPage();
      filters.setState({ endDate: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: "flex-end", md: "center" }}
        direction={{ xs: "column", md: "row" }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <DatePicker
          label="Start date"
          value={filters.state.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 200 } }}
        />

        <DatePicker
          label="End date"
          value={filters.state.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError
                ? "End date must be later than start date"
                : null,
            },
          }}
          sx={{
            maxWidth: { md: 200 },
            [`& .${formHelperTextClasses.root}`]: {
              position: { md: "absolute" },
              bottom: { md: -40 },
            },
          }}
        />

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={filters.state.customerName}
            onChange={handleFilterName}
            placeholder="Search customer or order number..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled" }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: "right-top" } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
