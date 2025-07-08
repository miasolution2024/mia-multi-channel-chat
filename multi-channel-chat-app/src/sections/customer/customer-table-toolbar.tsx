import { ChangeEvent, useCallback } from "react";

import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { Iconify } from "@/components/iconify";
import { usePopover, CustomPopover } from "@/components/custom-popover";
import { FilterCustomerState } from "./view/customer-list-view";

// ----------------------------------------------------------------------

type CustomerTableToolbarProps = {
  filters: {
    state: FilterCustomerState;
    setState: (updateState: Partial<FilterCustomerState>) => void;
    onResetState: () => void;
    canReset: boolean;
  };
  onResetPage: () => void;
};

// ----------------------------------------------------------------------

export function CustomerTableToolbar({
  filters,
  onResetPage,
}: CustomerTableToolbarProps) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onResetPage();
      filters.setState({ customerName: event.target.value });
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
            placeholder="Search..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              },
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
