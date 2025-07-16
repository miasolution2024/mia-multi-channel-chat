import { SettingsProvider } from "@/components/settings/context";
import "../styles/globals.css";
import AuthProvider from "@/auth/context/auth-provider";
import { defaultSettings } from "@/components/settings/config-settings";
import { ThemeProvider } from "@/theme/theme-provider";
import { MotionLazy } from "@/components/animate/motion-lazy";
import { Snackbar } from "@/components/snackbar";
import { ProgressBar } from "@/components/progress-bar";
import { I18nProvider, LocalizationProvider } from "@/locales";
import { CONFIG } from "@/config-global";
import { detectLanguage } from "@/locales/server";
import { SettingsDrawer } from "@/components/settings/drawer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = CONFIG.isStaticExport ? "vi" : await detectLanguage();

  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <I18nProvider lang={CONFIG.isStaticExport ? undefined : lang}>
          <LocalizationProvider>
            <AuthProvider>
              <SettingsProvider settings={defaultSettings}>
                <ThemeProvider>
                  <MotionLazy>
                    <Snackbar />
                    <ProgressBar />
                    <SettingsDrawer />
                    {children}
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </AuthProvider>
          </LocalizationProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
