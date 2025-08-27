"use client";

import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import { paths } from "@/routes/path";
import { useSettingsContext } from "@/components/settings";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { toast } from "@/components/snackbar";
import { ContentAssistantMultiStepForm } from "../content-assistant-multi-step-form";
import { updateContentAssistant } from "@/actions/content-assistant";

// ----------------------------------------------------------------------

export function ContentAssistantNewView() {
  const settings = useSettingsContext();
  const [isShowDraftButton, setIsShowDraftButton] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [watchMethod, setWatchMethod] = useState<(() => Record<string, unknown>) | null>(
    null
  );
  const [activeStep, setActiveStep] = useState(0);

  const handleIdChange = (
    watchMethod: () => Record<string, unknown>,
    activeStep: number
  ) => {
    const currentFormData = watchMethod();
    const id = currentFormData?.id as number | null;
    setWatchMethod(() => watchMethod);
    setActiveStep(activeStep);
    setIsShowDraftButton(!!id);
  };

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
    if (!watchMethod) return;
    
    const currentFormData = watchMethod();
    if (!currentFormData?.id) return;

    setIsSavingDraft(true);
    console.log("activeStep", activeStep);
    try {
      const updateData = {
        ...currentFormData,
        action: getActionByStep(activeStep),
        // Transform all RHFMultiSelect fields to correct format
        customer_group: {
          create: Array.isArray(currentFormData.customer_group)
            ? currentFormData.customer_group.map((groupId: number) => ({
                ai_content_suggestions_id: "0", // Will be set by backend after creation
                customer_group_id: { id: groupId },
              }))
            : [],
          update: [],
          delete: [],
        },
        customer_journey: {
          create: Array.isArray(currentFormData.customer_journey)
            ? currentFormData.customer_journey.map((journeyId: number) => ({
                ai_content_suggestions_id: "0", // Will be set by backend after creation
                customer_journey_id: { id: journeyId },
              }))
            : [],
          update: [],
          delete: [],
        },
        ai_rule_based: {
          create: Array.isArray(currentFormData.ai_rule_based)
            ? currentFormData.ai_rule_based.map((ruleId: number) => ({
                ai_content_suggestions_id: "0", // Will be set by backend after creation
                ai_rule_based_id: { id: ruleId },
              }))
            : [],
          update: [],
          delete: [],
        },
        content_tone: {
          create: Array.isArray(currentFormData.content_tone)
            ? currentFormData.content_tone.map((toneId: number) => ({
                ai_content_suggestions_id: "0", // Will be set by backend after creation
                content_tone_id: { id: toneId },
              }))
            : [],
          update: [],
          delete: [],
        },
        omni_channels: {
          create: Array.isArray(currentFormData.omni_channels)
            ? currentFormData.omni_channels.map((channelId: number) => ({
                ai_content_suggestions_id: "0", // Will be set by backend after creation
                omni_channels_id: { id: channelId },
              }))
            : [],
          update: [],
          delete: [],
        },
      };
      await updateContentAssistant(currentFormData.id as number, updateData);
      toast.success("Lưu nháp thành công!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Có lỗi xảy ra khi lưu nháp!");
    } finally {
      setIsSavingDraft(false);
    }
  }, [watchMethod, activeStep]);

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
        action={
          isShowDraftButton && (
            <Button
              variant="outlined"
              onClick={handleSaveDraft}
              loading={isSavingDraft}
              disabled={isSavingDraft}
              sx={{ borderRadius: 2 }}
            >
              {isSavingDraft ? "Đang lưu..." : "Lưu nháp"}
            </Button>
          )
        }
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <ContentAssistantMultiStepForm onIdChange={handleIdChange} />
      </Box>
    </Container>
  );
}
