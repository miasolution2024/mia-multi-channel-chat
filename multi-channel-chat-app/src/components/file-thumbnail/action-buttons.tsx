/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";

import { Iconify } from "../iconify";

// ----------------------------------------------------------------------

export function DownloadButton({ sx, ...other }: any) {
  const theme = useTheme();

  return (
    <ButtonBase
      sx={{
        p: 0,
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        opacity: 0,
        position: "absolute",
        color: "common.white",
        borderRadius: "inherit",
        transition: theme.transitions.create(["opacity"]),
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="eva:arrow-circle-down-fill" width={24} />
    </ButtonBase>
  );
}

// ----------------------------------------------------------------------

export function RemoveButton({ sx, ...other }: any) {
  return (
    <IconButton
      size="small"
      sx={{
        p: 0.35,
        top: 4,
        right: 4,
        position: "absolute",
        color: "common.white",
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={12} />
    </IconButton>
  );
}
