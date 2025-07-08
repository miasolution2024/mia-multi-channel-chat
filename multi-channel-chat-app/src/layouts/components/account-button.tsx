/* eslint-disable @typescript-eslint/no-explicit-any */
import { m } from "framer-motion";

import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { AnimateAvatar, varHover } from "@/components/animate";
import { NoSsr } from "@mui/material";

// ----------------------------------------------------------------------

export function AccountButton({ photoURL, displayName, sx, ...other }: any) {
  const theme = useTheme() as any;

  const renderFallback = (
    <Avatar
      src={photoURL}
      sx={{
        width: 40,
        height: 40,
        border: `solid 2px ${theme.vars.palette.background.default}`,
      }}
    ></Avatar>
  );

  return (
    <IconButton
      component={m.button}
      whileTap="tap"
      whileHover="hover"
      variants={varHover(1.05)}
      sx={{ p: 0, ...sx }}
      {...other}
    >
      <NoSsr fallback={renderFallback}>
        <AnimateAvatar
          slotProps={{
            avatar: { src: photoURL, alt: displayName },
            overlay: {
              border: 1,
              spacing: 2,
              color: `conic-gradient(${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}, ${theme.vars.palette.primary.main})`,
            },
          }}
        >
          {displayName?.charAt(0).toUpperCase()}
        </AnimateAvatar>
      </NoSsr>
    </IconButton>
  );
}
