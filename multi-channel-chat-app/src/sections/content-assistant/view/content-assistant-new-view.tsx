"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { paths } from "@/routes/path";
import { useSettingsContext } from "@/components/settings";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { ContentAssistantMultiStepForm } from "../content-assistant-multi-step-form";

// ----------------------------------------------------------------------

export function ContentAssistantNewView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Thêm mới bài viết"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Trợ lý nội dung",
            href: paths.dashboard.contentAssistant.root,
          },
          { name: "Thêm mới" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <ContentAssistantMultiStepForm />
      </Box>
    </Container>
  );
}
