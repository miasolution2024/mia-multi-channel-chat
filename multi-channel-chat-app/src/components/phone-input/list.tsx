/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";

import { usePopover } from "../custom-popover";
import { getCountry, applyFilter } from "./utils";
import { countries } from "@/assets/data";
import { FlagIcon, Iconify } from "../iconify";
import { SearchNotFound } from "../search-not-found";

// ----------------------------------------------------------------------

export function CountryListPopover({
  sx,
  countryCode,
  searchCountry,
  onClickCountry,
  onSearchCountry,
}: any) {
  const popover = usePopover();

  const selectedCountry = getCountry(countryCode);

  const dataFiltered = applyFilter({
    inputData: countries,
    query: searchCountry,
  });

  const notFound = dataFiltered.length === 0 && !!searchCountry;

  const renderButton = (
    <ButtonBase
      disableRipple
      onClick={popover.onOpen}
      sx={{
        zIndex: 9,
        display: "flex",
        position: "absolute",
        justifyContent: "flex-start",
        width: "var(--popover-button-width)",
        height: "var(--popover-button-height)",
        ...sx,
      }}
    >
      <FlagIcon
        code={selectedCountry?.code}
        sx={{
          borderRadius: "50%",
          width: "var(--popover-button-height)",
          height: "var(--popover-button-height)",
        }}
      />

      <Iconify
        icon="eva:chevron-down-fill"
        sx={{ ml: 0.25, flexShrink: 0, color: "text.disabled" }}
      />

      <Box
        component="span"
        sx={{
          height: 20,
          ml: "auto",
          width: "1px",
          bgcolor: (theme: any) => theme.vars.palette.divider,
        }}
      />
    </ButtonBase>
  );

  const renderList = (
    <MenuList>
      {dataFiltered.map((country: any) => {
        if (!country.code) {
          return null;
        }

        return (
          <MenuItem
            key={country.code}
            selected={countryCode === country.code}
            onClick={() => {
              popover.onClose();
              onSearchCountry("");
              onClickCountry(country.code);
            }}
          >
            <FlagIcon
              code={country.code}
              sx={{ mr: 1, width: 22, height: 22, borderRadius: "50%" }}
            />

            <ListItemText
              primary={country.label}
              secondary={`${country.code} (+${country.phone})`}
              slotProps={{
                primary: { noWrap: true, typography: "body2" },
                secondary: { typography: "caption" },
              }}
            />
          </MenuItem>
        );
      })}
    </MenuList>
  );

  return (
    <>
      {renderButton}

      <Popover
        disableRestoreFocus
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={() => {
          popover.onClose();
          onSearchCountry("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: 1,
              height: 320,
              maxWidth: 320,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box sx={{ px: 1, py: 1.5 }}>
          <TextField
            autoFocus
            fullWidth
            value={searchCountry}
            onChange={(event) => onSearchCountry(event.target.value)}
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
              endAdornment: searchCountry && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => onSearchCountry("")}
                  >
                    <Iconify width={16} icon="mingcute:close-line" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ flex: "1 1 auto", overflowX: "hidden" }}>
          {notFound ? (
            <SearchNotFound query={searchCountry} sx={{ px: 2, pt: 5 }} />
          ) : (
            renderList
          )}
        </Box>
      </Popover>
    </>
  );
}
