"use client";

import React, { useEffect, useState } from "react";
import { useSettingsContext } from "@/components/settings";
import { DashboardContent } from "@/layouts/dashboard";
import { Box, Container } from "@mui/material";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { paths } from "@/routes/path";
import { CampaignMultiStepForm } from "../campaign-multi-step-form";
import { LoadingScreen } from "@/components/loading-screen";
import { getCampaigns } from "@/actions/campaign";
import { Campaign } from "@/types/campaign";

interface CampaignEditViewProps {
  campaignId: string;
}

function CampaignEditView({ campaignId }: CampaignEditViewProps) {
  const settings = useSettingsContext();
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<Campaign | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const filters = {
          page: 1,
          limit: 25,
          id: Number(campaignId),
        };
        const data = await getCampaigns(filters);
        setEditData(data.data[0]);
      } catch (err) {
        console.error("Error loading content assistant:", err);
        setError("Không thể tải thông tin nội dung");
      } finally {
        setLoading(false);
      }
    }
    if (campaignId) {
      loadData();
    }
  }, [campaignId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : "lg"}>
          <Box sx={{ textAlign: "center", py: 5 }}>
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
