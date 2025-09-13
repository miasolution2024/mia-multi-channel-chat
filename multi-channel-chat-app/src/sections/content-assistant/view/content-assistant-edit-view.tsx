"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { LoadingScreen } from "@/components/loading-screen";

import { paths } from "@/routes/path";
import { useSettingsContext } from "@/components/settings";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { ContentAssistantMultiStepForm } from "../content-assistant-multi-step-form";
import { getContentAssistantById, type ContentAssistantApiResponse } from "@/actions/content-assistant";
import { toast } from "@/components/snackbar";
import { Content } from "./content-assistant-list-view";

// ----------------------------------------------------------------------

interface ContentAssistantEditViewProps {
  editData?: Content | ContentAssistantApiResponse | null;
}

export function ContentAssistantEditView({ editData: propEditData }: ContentAssistantEditViewProps) {
  const settings = useSettingsContext();
  const params = useParams();
  const [editData, setEditData] = useState<Content | ContentAssistantApiResponse | null>(propEditData || null);
  const [isLoading, setIsLoading] = useState(!propEditData);

  const contentId = params.id as string;

  useEffect(() => {
    // If editData is already provided as prop, don't fetch
    if (propEditData) {
      setEditData(propEditData);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      if (!contentId) {
        toast.error("ID không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getContentAssistantById(contentId);
        if (data) {
          setEditData(data);
        } else {
          toast.error("Không tìm thấy dữ liệu");
        }
      } catch (error) {
        console.error("Error fetching content assistant:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [contentId, propEditData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!editData) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa bài viết"
          links={[
            {
              name: "Dashboard",
              href: paths.dashboard.root,
            },
            {
              name: "Trợ lý nội dung",
              href: paths.dashboard.contentAssistant.root,
            },
            { name: "Chỉnh sửa" },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Box sx={{ textAlign: "center", py: 5 }}>
          Không tìm thấy dữ liệu
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Chỉnh sửa bài viết"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Trợ lý nội dung",
            href: paths.dashboard.contentAssistant.root,
          },
          { name: "Chỉnh sửa" },
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
        <ContentAssistantMultiStepForm editData={editData} />
      </Box>
    </Container>
  );
}