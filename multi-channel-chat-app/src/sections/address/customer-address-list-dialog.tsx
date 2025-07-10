/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { Customer } from "@/models/customer/customer";
import { Scrollbar } from "@/components/scrollbar";
import { Iconify } from "@/components/iconify";
import { SearchNotFound } from "@/components/search-not-found";

// ----------------------------------------------------------------------

type CustomerAddressListDialogProps = {
  list: Customer[];
  open: boolean;
  action?: React.ReactNode;
  onClose: () => void;
  selected: (id: string) => boolean;
  onSelect: (address: any) => void;
  title?: string;
};

// ----------------------------------------------------------------------

export function CustomerAddressListDialog({
  list,
  open,
  action,
  onClose,
  selected,
  onSelect,
  title = "Address book",
}: CustomerAddressListDialogProps) {
  const [searchAddress, setSearchAddress] = useState("");

  const dataFiltered = applyFilter({ inputData: list, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event: any) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback(
    (address: Customer) => {
      onSelect(address);
      setSearchAddress("");
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Scrollbar sx={{ p: 0.5, maxHeight: 480 }}>
      {dataFiltered.map((address: Customer) => (
        <ButtonBase
          key={address.id}
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
            ...(selected(`${address.id}`) && {
              bgcolor: "action.selected",
            }),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{address.name}</Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {address.address}
          </Typography>

          {address.phone_number && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {address.phone_number}
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
  inputData: Customer[];
  query: string;
}) {
  if (query) {
    return inputData.filter(
      (address) =>
        address.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        address.address.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        `${address.phone_number}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
