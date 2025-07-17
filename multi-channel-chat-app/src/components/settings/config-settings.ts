// ----------------------------------------------------------------------

import { defaultFont } from "@/theme/core/typography";

export const STORAGE_KEY = "app-settings";

interface DefaultSettingsProps {
  colorScheme: "light" | "dark" | "system";
  direction: string;
  contrast: string;
  navLayout: string;
  primaryColor: string;
  navColor: string;
  compactLayout: boolean;
  fontFamily: string;
}

export const defaultSettings: DefaultSettingsProps = {
  colorScheme: "light",
  direction: "ltr",
  contrast: "default",
  navLayout: "mini",
  primaryColor: "orange",
  navColor: "integrate",
  compactLayout: true,
  fontFamily: defaultFont,
};
