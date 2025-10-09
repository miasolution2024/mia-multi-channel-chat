"use client";

import React, { useEffect, useState } from "react";
import { useSettingsContext } from "@/components/settings";
import { DashboardContent } from "@/layouts/dashboard";
import { Box, Container } from "@mui/material";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { paths } from "@/routes/path";
import { CampaignMultiStepForm } from "../campaign-multi-step-form";
import { useGetCampaignById } from "@/hooks/apis/use-get-campaign-by-id";
import { LoadingScreen } from "@/components/loading-screen";

interface CampaignEditViewProps {
  campaignId: string;
}

function CampaignEditView({ campaignId }: CampaignEditViewProps) {
  const settings = useSettingsContext();
  const { data: editData, isLoading, error, fetchData } = useGetCampaignById();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (campaignId && !hasInitialized) {
      setHasInitialized(true);
      fetchData(campaignId).catch((err) => {
        console.error('Failed to fetch campaign data:', err);
      });
    }
  }, [campaignId, fetchData, hasInitialized]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : "lg"}>
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <p>Lỗi: {error}</p>
          </Box>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa chiến dịch"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Chiến dịch Marketing",
              href: paths.dashboard.marketingCampaign.root,
            },
            { name: "Chỉnh sửa" },
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
        <CampaignMultiStepForm editData={editData} />
      </Box>
      </Container>
    </DashboardContent>
  );
}

export default CampaignEditView;
