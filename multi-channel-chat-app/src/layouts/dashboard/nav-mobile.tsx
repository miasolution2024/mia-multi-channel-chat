/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import Box from "@mui/material/Box";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import { Scrollbar } from "@/components/scrollbar";
import { NavSectionVertical } from "@/components/nav-section";
import { usePathname } from "next/navigation";
import { AnimateAvatar } from "@/components/animate";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { CONFIG } from "@/config-global";
import { varAlpha } from "@/theme/styles";
import { useTheme } from "@emotion/react";

// ----------------------------------------------------------------------

export function NavMobile({ data, open, onClose, slots, sx, ...other }: any) {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const theme = useTheme() as any;

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: {
          src:
            user?.photoURL ??
            `${CONFIG.assetsDir}/assets/images/avatar/default.jpg`,
          alt: user?.fullName,
        },
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
      {user?.fullName?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          overflow: "unset",
          bgcolor: "var(--layout-nav-bg)",
          width: "var(--layout-nav-mobile-width)",
          ...sx,
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>{renderAvatar}</Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={data}
          sx={{ px: 2, flex: "1 1 auto" }}
          {...other}
        />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
