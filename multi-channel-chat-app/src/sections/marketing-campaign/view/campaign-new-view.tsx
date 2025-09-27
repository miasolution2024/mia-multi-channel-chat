"use client";

import React from "react";
import { useSettingsContext } from "@/components/settings";
import { DashboardContent } from "@/layouts/dashboard";
import { Box, Container } from "@mui/material";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { paths } from "@/routes/path";
import { CampaignMultiStepForm } from "../campaign-multi-step-form";



function CampaignNewView() {
  const settings = useSettingsContext();


 
  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Tạo chiến dịch mới"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Chiến dịch Marketing",
              href: paths.dashboard.marketingCampaign.root,
            },
            { name: "Tạo mới" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
         <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CampaignMultiStepForm />
      </Box>
      </Container>
    </DashboardContent>
  );
}

export default CampaignNewView;
