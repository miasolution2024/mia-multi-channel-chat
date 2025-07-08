/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";

// ----------------------------------------------------------------------

const cacheRtl = createCache({
  key: "rtl",
  prepend: true,
  stylisPlugins: [rtlPlugin],
});

export function RTL({ children, direction }: any) {
  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  if (direction === "rtl") {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  }

  return <>{children}</>;
}
