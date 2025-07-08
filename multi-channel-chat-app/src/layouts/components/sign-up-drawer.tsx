/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { Stack } from "@mui/material";
import { JwtSignUpView } from "@/auth/view/sign-up-view";

// ----------------------------------------------------------------------

export function SignUpDrawer({ open, onClose }: any) {
  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        sx={{ zIndex: 1301 }}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 370 } }}
      >
        <IconButton
          onClick={onClose}
          sx={{ top: 12, left: 12, zIndex: 9, position: "absolute" }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Stack sx={{ pt: 8, px: 4 }}>
            <JwtSignUpView />
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
