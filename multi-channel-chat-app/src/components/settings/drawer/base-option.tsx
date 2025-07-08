/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import ButtonBase from "@mui/material/ButtonBase";
import { varAlpha } from "@/theme/styles";
import { CONFIG } from "@/config-global";
import { Iconify } from "@/components/iconify";
import { SvgColor } from "@/components/svg-color";

// ----------------------------------------------------------------------

export function BaseOption({ icon, label, tooltip, selected, ...other }: any) {
  return (
    <ButtonBase
      disableRipple
      sx={{
        px: 2,
        py: 2.5,
        borderRadius: 2,
        cursor: "pointer",
        flexDirection: "column",
        alignItems: "flex-start",
        border: (theme: any) =>
          `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.12)}`,
        "&:hover": {
          bgcolor: (theme: any) =>
            varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        },
        ...(selected && {
          bgcolor: (theme: any) =>
            varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
        }),
      }}
      {...other}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: 1, mb: 3 }}
      >
        <SvgColor
          src={`${CONFIG.assetsDir}/assets/icons/settings/ic-${icon}.svg`}
        />
        <Switch
          name={label}
          size="small"
          color="default"
          checked={selected}
          sx={{ mr: -0.75 }}
        />
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: 1 }}
      >
        <Box
          component="span"
          sx={{
            lineHeight: "18px",
            fontWeight: "fontWeightSemiBold",
            fontSize: (theme) => theme.typography.pxToRem(13),
          }}
        >
          {label}
        </Box>

        {tooltip && (
          <Tooltip
            arrow
            title={tooltip}
            slotProps={{
              tooltip: { sx: { maxWidth: 240, mr: 0.5 } },
            }}
          >
            <Iconify
              width={16}
              icon="eva:info-outline"
              sx={{ cursor: "pointer", color: "text.disabled" }}
            />
          </Tooltip>
        )}
      </Box>
    </ButtonBase>
  );
}
