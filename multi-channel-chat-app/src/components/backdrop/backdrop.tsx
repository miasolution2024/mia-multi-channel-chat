import { Backdrop as MUIBackdrop, CircularProgress } from "@mui/material";
import React from "react";

export default function Backdrop({ open }: { open: boolean }) {
  return (
    <MUIBackdrop
      open={open}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
      <CircularProgress color="inherit" />
    </MUIBackdrop>
  );
}
