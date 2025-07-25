/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import { useTheme, useColorScheme } from "@mui/material/styles";

import { Iconify } from "../../iconify";
import { BaseOption } from "./base-option";
import { NavOptions } from "./nav-options";
import { useSettingsContext } from "../context";
import { PresetsOptions } from "./presets-options";
import { FullScreenButton } from "./fullscreen-button";
import { paper, varAlpha } from "@/theme/styles";
import { FontOptions } from "./font-options";
import { defaultFont } from "@/theme/core";
import PRIMARY_COLOR from "@/theme/with-settings/primary-color.json";
import COLORS from "@/theme/core/colors.json";
import { Scrollbar } from "@/components/scrollbar";
import { defaultSettings } from "../config-settings";

// ----------------------------------------------------------------------

export function SettingsDrawer({
  sx,
  hideFont,
  hideCompact,
  hidePresets,
  hideNavColor,
  hideContrast,
  hideNavLayout,
  hideDirection,
  hideColorScheme,
}: any) {
  const theme = useTheme() as any;

  const settings = useSettingsContext() as any;

  const { mode, setMode } = useColorScheme();

  const renderHead = (
    <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Settings
      </Typography>

      <FullScreenButton />

      <Tooltip title="Reset">
        <IconButton
          onClick={() => {
            settings.onReset();
            setMode(defaultSettings.colorScheme);
          }}
        >
          <Badge color="error" variant="dot" invisible={!settings.canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Close">
        <IconButton onClick={settings.onCloseDrawer}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderMode = (
    <BaseOption
      label="Dark mode"
      icon="moon"
      selected={settings.colorScheme === "dark"}
      onClick={() => {
        settings.onUpdateField(
          "colorScheme",
          mode === "light" ? "dark" : "light"
        );
        setMode(mode === "light" ? "dark" : "light");
      }}
    />
  );

  const renderContrast = (
    <BaseOption
      label="Contrast"
      icon="contrast"
      selected={settings.contrast === "hight"}
      onClick={() =>
        settings.onUpdateField(
          "contrast",
          settings.contrast === "default" ? "hight" : "default"
        )
      }
    />
  );

  const renderRTL = (
    <BaseOption
      label="Right to left"
      icon="align-right"
      selected={settings.direction === "rtl"}
      onClick={() =>
        settings.onUpdateField(
          "direction",
          settings.direction === "ltr" ? "rtl" : "ltr"
        )
      }
    />
  );

  const renderCompact = (
    <BaseOption
      tooltip="Dashboard only and available at large resolutions > 1600px (xl)"
      label="Compact"
      icon="autofit-width"
      selected={settings.compactLayout}
      onClick={() =>
        settings.onUpdateField("compactLayout", !settings.compactLayout)
      }
    />
  );

  const renderPresets = (
    <PresetsOptions
      value={settings.primaryColor}
      onClickOption={(newValue: any) =>
        settings.onUpdateField("primaryColor", newValue)
      }
      options={[
        { name: "default", value: COLORS.primary.main },
        { name: "cyan", value: PRIMARY_COLOR.cyan.main },
        { name: "purple", value: PRIMARY_COLOR.purple.main },
        { name: "blue", value: PRIMARY_COLOR.blue.main },
        { name: "orange", value: PRIMARY_COLOR.orange.main },
        { name: "red", value: PRIMARY_COLOR.red.main },
      ]}
    />
  );

  const renderNav = (
    <NavOptions
      value={{
        color: settings.navColor,
        layout: settings.navLayout,
      }}
      onClickOption={{
        color: (newValue: any) => settings.onUpdateField("navColor", newValue),
        layout: (newValue: any) =>
          settings.onUpdateField("navLayout", newValue),
      }}
      options={{
        colors: ["integrate", "apparent"],
        layouts: ["vertical", "horizontal", "mini"],
      }}
      hideNavColor={hideNavColor}
      hideNavLayout={hideNavLayout}
    />
  );

  const renderFont = (
    <FontOptions
      value={settings.fontFamily}
      onClickOption={(newValue: any) =>
        settings.onUpdateField("fontFamily", newValue)
      }
      options={[
        defaultFont,
        "Inter Variable",
        "DM Sans Variable",
        "Nunito Sans Variable",
      ]}
    />
  );

  return (
    <Drawer
      anchor="right"
      open={settings.openDrawer}
      onClose={settings.onCloseDrawer}
      slotProps={{ backdrop: { invisible: true } }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          ...paper({
            theme,
            color: varAlpha(theme.vars.palette.background.defaultChannel, 0.9),
          }),
          width: 360,
          ...sx,
        },
      }}
    >
      {renderHead}

      <Scrollbar>
        <Stack spacing={6} sx={{ px: 2.5, pb: 5 }}>
          <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
            {!hideColorScheme && renderMode}
            {!hideContrast && renderContrast}
            {!hideDirection && renderRTL}
            {!hideCompact && renderCompact}
          </Box>
          {!(hideNavLayout && hideNavColor) && renderNav}
          {!hidePresets && renderPresets}
          {!hideFont && renderFont}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
