"use client";

import { Container } from "@mui/material";

import { paths } from "@/routes/path";
import { DashboardContent } from "@/layouts/dashboard";
import { useSettingsContext } from "@/components/settings";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";

import { KnowledgeBasedNewEditForm } from "../knowledge-based-new-edit-form";

// ----------------------------------------------------------------------

export function KnowledgeBasedNewView() {
  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Tạo kiến thức mới"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Kiến thức AI",
              href: paths.dashboard.knowledgeBased.root,
            },
            { name: "Tạo mới" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <KnowledgeBasedNewEditForm />
      </Container>
    </DashboardContent>
  );
}
