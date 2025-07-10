/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { AccountButton } from "./account-button";
import { SignOutButton } from "./sign-out-button";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { AnimateAvatar } from "@/components/animate";
import { varAlpha } from "@/theme/styles";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { paths } from "@/routes/path";
import { Label } from "@/components/label";

// ----------------------------------------------------------------------

export function AccountDrawer({ data = [], sx, ...other }: any) {
  const theme = useTheme() as any;

  const router = useRouter();

  const pathname = usePathname();

  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleCloseDrawer();
      router.push(path);
    },
    [handleCloseDrawer, router]
  );

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: user?.avatar, alt: user?.first_name },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(
            theme.vars.palette.primary.mainChannel,
            0
          )} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {user?.full_name?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        onClick={handleOpenDrawer}
        photoURL={user?.avatar}
        fullName={user?.full_name}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: "absolute" }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Stack alignItems="center" sx={{ pt: 8, pb: 3 }}>
            {renderAvatar}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.full_name}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
              noWrap
            >
              {user?.email}
            </Typography>
          </Stack>

          <Stack
            sx={{
              py: 3,
              px: 2.5,
              borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
            }}
          >
            {data.map((option: any) => {
              const rootLabel = pathname.includes("/dashboard")
                ? "Home"
                : "Dashboard";

              const rootHref = pathname.includes("/dashboard")
                ? "/"
                : paths.dashboard.root;

              return (
                <MenuItem
                  key={option.label}
                  onClick={() =>
                    handleClickItem(
                      option.label === "Home" ? rootHref : option.href
                    )
                  }
                  sx={{
                    py: 1,
                    color: "text.secondary",
                    "& svg": { width: 24, height: 24 },
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {option.icon}

                  <Box component="span" sx={{ ml: 2 }}>
                    {option.label === "Home" ? rootLabel : option.label}
                  </Box>

                  {option.info && (
                    <Label color="error" sx={{ ml: 1 }}>
                      {option.info}
                    </Label>
                  )}
                </MenuItem>
              );
            })}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}
