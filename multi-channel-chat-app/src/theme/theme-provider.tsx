/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { createTheme } from "./create-theme";
import { schemeConfig } from "./scheme-config";
import { RTL } from "./with-settings/right-to-left";
import { useSettingsContext } from "@/components/settings/context";

// ----------------------------------------------------------------------

export function ThemeProvider({ children }: any) {
  const settings = useSettingsContext() as any;

  const theme = createTheme(settings);

  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider
        theme={theme}
        defaultMode={schemeConfig.defaultMode}
        modeStorageKey={schemeConfig.modeStorageKey}
      >
        <CssBaseline />
        <RTL direction={settings.direction}>{children}</RTL>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
