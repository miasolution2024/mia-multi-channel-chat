/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import { layoutClasses } from "../classes";

// ----------------------------------------------------------------------

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
}: any) {
  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          "--layout-nav-zIndex": 1101,
          "--layout-nav-mobile-width": "261px",
          "--layout-header-blur": "8px",
          "--layout-header-zIndex": 1100,
          "--layout-header-mobile-height": "64px",
          "--layout-header-desktop-height": "72px",
          ...cssVars,
        },
      }}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <Box id="root__layout" className={layoutClasses.root} sx={sx}>
        {sidebarSection ? (
          <>
            {sidebarSection}
            <Box
              display="flex"
              flex="1 1 auto"
              flexDirection="column"
              className={layoutClasses.hasSidebar}
            >
              {headerSection}
              {children}
              {footerSection}
            </Box>
          </>
        ) : (
          <>
            {headerSection}
            {children}
            {footerSection}
          </>
        )}
      </Box>
    </>
  );
}
