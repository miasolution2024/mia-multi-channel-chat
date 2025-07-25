/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "dayjs/locale/en";
import "dayjs/locale/vi";
import "dayjs/locale/fr";
import "dayjs/locale/zh-cn";
import "dayjs/locale/ar-sa";

import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider as Provider } from "@mui/x-date-pickers/LocalizationProvider";

import { useTranslate } from "./use-locales";

// ----------------------------------------------------------------------

export function LocalizationProvider({ children }: any) {
  const { currentLang } = useTranslate();

  dayjs.locale(currentLang.adapterLocale);

  return (
    <Provider
      dateAdapter={AdapterDayjs}
      adapterLocale={currentLang.adapterLocale}
    >
      {children}
    </Provider>
  );
}
