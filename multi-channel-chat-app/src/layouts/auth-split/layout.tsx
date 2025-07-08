/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Alert from "@mui/material/Alert";

import { Main, Content } from "./main";
import { HeaderSection } from "../core/header-section";
import { LayoutSection } from "../core/layout-section";
import { Logo } from "@/components/logo";

// ----------------------------------------------------------------------

export function AuthSplitLayout({ sx, children, header }: any) {
  const layoutQuery = "md";

  return (
    <LayoutSection
      headerSection={
        /** **************************************
         * Header
         *************************************** */
        <HeaderSection
          disableElevation
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: "fixed" }, ...header?.sx }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: <Logo />,
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ "--layout-auth-content-width": "420px" }}
      sx={sx}
    >
      <Main layoutQuery={layoutQuery}>
        <Content layoutQuery={layoutQuery}>{children}</Content>
      </Main>
    </LayoutSection>
  );
}
