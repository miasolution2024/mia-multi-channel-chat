/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback, createContext } from "react";

import { STORAGE_KEY, defaultSettings } from "../config-settings";
import { useCookies } from "@/hooks/use-cookies";
import { useLocalStorage } from "@/hooks/use-local-storage";

// ----------------------------------------------------------------------

export const SettingsContext = createContext(undefined);

export const SettingsConsumer = SettingsContext.Consumer;

// ----------------------------------------------------------------------

export function SettingsProvider({
  children,
  settings,
  caches = "localStorage",
}: any) {
  const cookies = useCookies(STORAGE_KEY, settings, defaultSettings);

  const localStorage = useLocalStorage(STORAGE_KEY, settings);

  const values = caches === "cookie" ? cookies : localStorage;

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ...values.state,
      canReset: values.canReset,
      onReset: values.resetState,
      onUpdate: values.setState,
      onUpdateField: values.setField,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    }),
    [
      values.state,
      values.setField,
      values.setState,
      values.canReset,
      values.resetState,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    ]
  );

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}
