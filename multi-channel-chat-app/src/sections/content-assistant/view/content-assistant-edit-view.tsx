"use client";

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import { paths } from "@/routes/path";
import { useSettingsContext } from "@/components/settings";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { toast } from "@/components/snackbar";
import { ContentAssistantMultiStepForm } from "../content-assistant-multi-step-form";
import { updateContentAssistant } from "@/actions/content-assistant";
import { Content } from "./content-assistant-list-view";

// ----------------------------------------------------------------------

type Props = {
  editData: Content;
};

export function ContentAssistantEditView({ editData }: Props) {
  const settings = useSettingsContext();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [watchMethod, setWatchMethod] = useState<(() => Record<string, unknown>) | null>(
    null
  );
  const [activeStep, setActiveStep] = useState(0);

  const handleIdChange = (
    watchMethod: () => Record<string, unknown>,
    activeStep: number
  ) => {
    setWatchMethod(() => watchMethod);
    setActiveStep(activeStep);
  };
  useEffect(() => {
    if (editData && editData.action) {
      const getStepByAction = (action: string) => {
        const actions = [
          "research_analysis", // Step 0
          "make_outline", // Step 1
          "write_article", // Step 2
          "generate_image", // Step 3
        ];
        return actions.indexOf(action);
      };
      setActiveStep(getStepByAction(editData.action));
    }
  }, [editData]);

  const getActionByStep = (step: number): string => {
    const actions = [
      "research_analysis", // Step 0
      "make_outline", // Step 1
      "write_article", // Step 2
      "generate_image", // Step 3
      "HTML_coding", // Step 4
    ];
    return actions[step] || "research_analysis";
  };

  const handleSaveDraft = useCallback(async () => {
    if (!editData?.id || !watchMethod) return;

    setIsSavingDraft(true);
    console.log("activeStep", activeStep);
    try {
      const currentFormData = watchMethod();
      const updateData = {
        ...currentFormData,
        action: getActionByStep(activeStep),
        customer_group: {
          create: Array.isArray(currentFormData.customer_group)
            ? currentFormData.customer_group
                .filter(
                  (groupId: number) =>
                    !editData.customer_group?.some(
                      (item) => item.customer_group_id.id === groupId
                    )
                )
                .map((groupId: number) => ({
                  ai_content_suggestions_id: editData.id.toString(),
                  customer_group_id: { id: groupId },
                }))
            : [],
          update: [],
          delete: [],
        },
        customer_journey: {
          create: Array.isArray(currentFormData.customer_journey)
            ? currentFormData.customer_journey
                .filter(
                  (journeyId: number) =>
                    !editData.customer_journey?.some(
                      (item) => item.customer_journey_id.id === journeyId
                    )
                )
                .map((journeyId: number) => ({
                  ai_content_suggestions_id: editData.id.toString(),
                  customer_journey_id: { id: journeyId },
                }))
            : [],
          update: [],
          delete: [],
        },
        ai_rule_based: {
          create: Array.isArray(currentFormData.ai_rule_based)
            ? currentFormData.ai_rule_based
                .filter(
                  (ruleId: number) =>
                    !editData.ai_rule_based?.some(
                      (item) => item.ai_rule_based_id.id === ruleId
                    )
                )
                .map((ruleId: number) => ({
                  ai_content_suggestions_id: editData.id.toString(),
                  ai_rule_based_id: { id: ruleId },
                }))
            : [],
          update: [],
          delete: [],
        },
        content_tone: {
          create: Array.isArray(currentFormData.content_tone)
            ? currentFormData.content_tone
                .filter(
                  (toneId: number) =>
                    !editData.content_tone?.some(
                      (item) => item.content_tone_id.id === toneId
                    )
                )
                .map((toneId: number) => ({
                  ai_content_suggestions_id: editData.id.toString(),
                  content_tone_id: { id: toneId },
                }))
            : [],
          update: [],
          delete: [],
        },
        omni_channels: {
          create: Array.isArray(currentFormData.omni_channels)
            ? currentFormData.omni_channels
                .filter(
                  (channelId: number) =>
                    !editData.omni_channels?.some(
                      (item) => item.omni_channels_id === channelId
                    )
                )
                .map((channelId: number) => ({
                  ai_content_suggestions_id: editData.id.toString(),
                  omni_channels_id: { id: channelId },
                }))
            : [],
          update: [],
          delete: [],
        },
      };
      await updateContentAssistant(editData.id, updateData);
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setIsSavingDraft(false);
    }
  }, [editData, watchMethod, activeStep]);

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
        action={
          <Button
            variant="outlined"
            onClick={handleSaveDraft}
            loading={isSavingDraft}
            disabled={isSavingDraft}
            sx={{ borderRadius: 2 }}
          >
            {isSavingDraft ? "Đang cập nhật..." : "Lưu nháp"}
          </Button>
        }
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <ContentAssistantMultiStepForm
          editData={editData}
          onIdChange={handleIdChange}
        />
      </Box>
    </Container>
  );
}
