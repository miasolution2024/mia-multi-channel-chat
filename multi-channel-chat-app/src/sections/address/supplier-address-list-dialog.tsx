/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { Supplier } from "@/models/supplier/supplier";
import { Scrollbar } from "@/components/scrollbar";
import { Iconify } from "@/components/iconify";
import { SearchNotFound } from "@/components/search-not-found";

// ----------------------------------------------------------------------

type SupplierAddressListDialogProps = {
  list: Supplier[];
  open: boolean;
  action?: React.ReactNode;
  onClose: () => void;
  selected: (id: string) => boolean;
  onSelect: (address: any) => void;
  title?: string;
};

// ----------------------------------------------------------------------

export function SupplierAddressListDialog({
  list,
  open,
  action,
  onClose,
  selected,
  onSelect,
  title = "Address book",
}: SupplierAddressListDialogProps) {
  const [searchAddress, setSearchAddress] = useState("");

  const dataFiltered = applyFilter({ inputData: list, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event: any) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback(
    (address: Supplier) => {
      onSelect(address);
      setSearchAddress("");
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Scrollbar sx={{ p: 0.5, maxHeight: 480 }}>
      {dataFiltered.map((address: Supplier) => (
        <ButtonBase
          key={address.supplierID}
          onClick={() => handleSelectAddress(address)}
          sx={{
            py: 1,
            my: 0.5,
            px: 1.5,
            gap: 0.5,
            width: 1,
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            ...(selected(`${address.supplierID}`) && {
              bgcolor: "action.selected",
            }),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{address.supplierName}</Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {address.address}
          </Typography>

          {address.phone && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {address.phone}
            </Typography>
          )}
        </ButtonBase>
      ))}
    </Scrollbar>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Stack>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="Search..."
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
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList
      )}
    </Dialog>
  );
}

function applyFilter({
  inputData,
  query,
}: {
  inputData: Supplier[];
  query: string;
}) {
  if (query) {
    return inputData.filter(
      (address) =>
        address.supplierName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        address.address.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        `${address.phone}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
