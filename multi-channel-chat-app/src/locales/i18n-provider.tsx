/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import i18next from "i18next";
import { useMemo } from "react";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next, I18nextProvider as Provider } from "react-i18next";

import { i18nOptions, fallbackLng } from "./config-locales";
import { CONFIG } from "@/config-global";
import { localStorageGetItem } from "@/utils/storage-available";

// ----------------------------------------------------------------------

let lng;

/**
 * [1] localStorage
 * Auto detection:
 * const lng = localStorageGetItem('i18nextLng')
 */
if (CONFIG.isStaticExport) {
  lng = localStorageGetItem("i18nextLng", fallbackLng);
}

const init = CONFIG.isStaticExport
  ? { ...i18nOptions(lng), detection: { caches: ["localStorage"] } }
  : { ...i18nOptions(), detection: { caches: ["cookie"] } };

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (lang: any, ns: any) => import(`./langs/${lang}/${ns}.json`)
    )
  )
  .init(init);

// ----------------------------------------------------------------------

export function I18nProvider({ lang, children }: any) {
  useMemo(() => {
    if (lang) {
      i18next.changeLanguage(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Provider i18n={i18next}>{children}</Provider>;
}
