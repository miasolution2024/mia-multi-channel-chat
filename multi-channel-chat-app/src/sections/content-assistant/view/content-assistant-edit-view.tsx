"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

import { paths } from "@/routes/path";
import { useSettingsContext } from "@/components/settings";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { ContentAssistantNewEditForm } from "../content-assistant-new-edit-form";
import { Content } from "./content-assistant-list-view";

// ----------------------------------------------------------------------

type Props = {
  contentId: string;
};

export function ContentAssistantEditView({ contentId }: Props) {
  const settings = useSettingsContext();
  const router = useRouter();

  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    const fetchContent = async () => {
      try {
        // Thay thế bằng API call thực tế
        const mockContent: Content = {
          id: contentId,
          topic: "Bài viết mẫu",
          post_type: "Blog",
          main_seo_keyword: "SEO chính",
          secondary_seo_keywords: ["SEO phụ 1", "SEO phụ 2"],
          customer_group: [1, 2],
          customer_journey: [1],
          description: "<p>Nội dung mẫu cho bài viết</p>",
          created_at: new Date().toISOString(),
          status: "published",
        };

        setCurrentContent(mockContent);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  const handleGoBack = () => {
    router.push(paths.dashboard.contentAssistant.root);
  };

  if (loading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Typography>Đang tải...</Typography>
        </Box>
      </Container>
    );
  }

  if (!currentContent) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Typography>Không tìm thấy nội dung</Typography>
          <Button onClick={handleGoBack} sx={{ mt: 2 }}>
            Quay lại
          </Button>
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
          { name: currentContent.topic },
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
        <Box
          sx={{
            borderRadius: 1.5,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              display: "flex",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <Box
              component="img"
              src="/assets/icons/modules/ic_content.svg"
              sx={{ width: 24, height: 24 }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1">
              Chỉnh sửa nội dung bài viết
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              Bạn có thể chỉnh sửa thông tin và nội dung của bài viết tại đây.
            </Typography>
          </Box>
        </Box>

        <ContentAssistantNewEditForm currentContent={currentContent} />
      </Box>
    </Container>
  );
}
