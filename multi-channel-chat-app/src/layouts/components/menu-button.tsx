/* eslint-disable @typescript-eslint/no-explicit-any */
import IconButton from "@mui/material/IconButton";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function MenuButton({ sx, ...other }: any) {
  return (
    <IconButton sx={sx} {...other}>
      <Iconify icon="heroicons-outline:menu-alt-2" />
    </IconButton>
  );
}
