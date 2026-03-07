"use client";

import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";

import { paths } from "@/routes/path";
import { DashboardContent } from "@/layouts/dashboard";
import { useSettingsContext } from "@/components/settings";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { toast } from "@/components/snackbar";
import { getKnowledgeBased } from "@/actions/knowledge-based";

import { KnowledgeBasedNewEditForm } from "../knowledge-based-new-edit-form";
import { KnowledgeBased } from "../types";

// ----------------------------------------------------------------------

type Props = {
  itemId: string | number;
};

export function KnowledgeBasedEditView({ itemId }: Props) {
  const settings = useSettingsContext();
  const [currentItem, setCurrentItem] = useState<KnowledgeBased | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await getKnowledgeBased(itemId);
        setCurrentItem(response.data);
      } catch (error) {
        console.error("Error fetching knowledge based:", error);
        toast.error("Không thể tải thông tin kiến thức");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : "lg"}>
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardContent>
    );
  }

  if (error || !currentItem) {
    return (
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : "lg"}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Kiến thức không tồn tại
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Chỉnh sửa kiến thức"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Kiến thức AI",
              href: paths.dashboard.knowledgeBased.root,
            },
            { name: currentItem.code || `#${currentItem.id}` },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <KnowledgeBasedNewEditForm currentItem={currentItem} />
      </Container>
    </DashboardContent>
  );
}
