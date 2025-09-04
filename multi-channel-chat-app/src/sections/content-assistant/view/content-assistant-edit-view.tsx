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
import { uploadFile } from "@/actions/upload";
import { Content } from "./content-assistant-list-view";

// Interface for File with additional properties from API transformation
interface FileWithApiProperties extends File {
  path?: string;
  preview?: string;
  idItem?: string;
}

// Interface for MediaGeneratedAiItem
interface MediaGeneratedAiItem {
  id?: number;
  directus_files_id: string;
}

// ----------------------------------------------------------------------

type Props = {
  editData: Content;
};

export function ContentAssistantEditView({ editData }: Props) {
  const settings = useSettingsContext();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [watchMethod, setWatchMethod] = useState<
    (() => Record<string, unknown>) | null
  >(null);
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
    try {
      const currentFormData = watchMethod();

      // Upload media files if any
      const uploadMediaFiles = async (
        files: File[]
      ): Promise<Array<{ id: string }>> => {
        const uploadPromises = files.map(async (file) => {
          const response = await uploadFile(file);
          return { id: response.data.id };
        });
        return Promise.all(uploadPromises);
      };

      // Compare current media with editData.media to find new files
      const getNewMediaFiles = (
        currentMedia: FileWithApiProperties[],
        originalMedia: FileWithApiProperties[]
      ): FileWithApiProperties[] => {
        if (!Array.isArray(currentMedia)) return [];
        if (!Array.isArray(originalMedia)) return currentMedia;

        return currentMedia.filter((currentFile) => {
          // Check if this file exists in original media
          // Files from API have 'path' property starting with 'image-'
          // New uploaded files don't have this property or have different path
          const isFromApi =
            currentFile.path && currentFile.path.startsWith("image-");
          if (!isFromApi) {
            // This is a new uploaded file
            return true;
          }

          // Check if this API file still exists in original data
          return !originalMedia.some(
            (originalFile) => originalFile.path === currentFile.path
          );
        });
      };

      // Find deleted media files (files that exist in original but not in current)
      const getDeletedMediaFiles = (
        currentMedia: FileWithApiProperties[],
        originalMedia: FileWithApiProperties[]
      ): string[] => {
        if (!Array.isArray(originalMedia)) return [];
        if (!Array.isArray(currentMedia))
          return originalMedia
            .map((file) => file.idItem)
            .filter(Boolean) as string[];

        return originalMedia
          .filter((originalFile) => {
            // Only consider API files (files with path starting with 'image-')
            const isFromApi =
              originalFile.path && originalFile.path.startsWith("image-");
            if (!isFromApi) return false;

            // Check if this original file still exists in current media
            return !currentMedia.some(
              (currentFile) => currentFile.path === originalFile.path
            );
          })
          .map((file) => file.idItem)
          .filter(Boolean) as string[];
      };

      // Find deleted media_generated_ai items
      const getDeletedMediaGeneratedAiFiles = (
        currentMediaGeneratedAi: string[] | MediaGeneratedAiItem[],
        originalMediaGeneratedAi: MediaGeneratedAiItem[]
      ): string[] => {
        if (!Array.isArray(originalMediaGeneratedAi)) return [];
        if (!Array.isArray(currentMediaGeneratedAi))
          return originalMediaGeneratedAi
            .map((item) => item.id?.toString())
            .filter(Boolean) as string[];

        return originalMediaGeneratedAi
          .filter((originalItem) => {
            // Check if this original item still exists in current media_generated_ai
            return !currentMediaGeneratedAi.some((currentItem) => {
              // Compare by directus_files_id if it's a string, or by id if it's an object
              const currentId =
                typeof currentItem === "string"
                  ? currentItem
                  : currentItem.directus_files_id;
              return currentId === originalItem.directus_files_id;
            });
          })
          .map((item) => item.id?.toString())
          .filter(Boolean) as string[];
      };

      const newMediaFiles = getNewMediaFiles(
        currentFormData.media as FileWithApiProperties[],
        editData.media as FileWithApiProperties[]
      );

      const deletedMediaIds = getDeletedMediaFiles(
        currentFormData.media as FileWithApiProperties[],
        editData.media as FileWithApiProperties[]
      );

      const deletedMediaGeneratedAiIds = getDeletedMediaGeneratedAiFiles(
        (currentFormData.media_generated_ai as
          | string[]
          | MediaGeneratedAiItem[]) || [],
        editData.media_generated_ai || []
      );

      let mediaArray: Array<{ id: string }> = [];
      if (newMediaFiles.length > 0) {
        mediaArray = await uploadMediaFiles(newMediaFiles);
      }
      
      // Handle video upload separately
      let videoId: string | null = null;
      if (Array.isArray(currentFormData.video) && currentFormData.video.length > 0) {
        const videoUploadResult = await uploadFile(currentFormData.video[0]);
        videoId = videoUploadResult.data.id;
      }
      

      
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
        media: {
          create: mediaArray.map((item) => ({
            ai_content_suggestions_id: "+",
            directus_files_id: { id: item.id },
          })),
          update: [],
          delete: deletedMediaIds,
        },
        video: videoId,
        media_generated_ai: {
          create: Array.isArray(currentFormData.media_generated_ai)
            ? currentFormData.media_generated_ai
                .filter((item: string | MediaGeneratedAiItem) => {
                  // Include all string items (new generated images)
                  if (typeof item === "string") {
                    return true;
                  }
                  return false; // Don't include existing objects in create
                })
                .map((fileId: string) => ({
                  ai_content_suggestions_id: "+",
                  directus_files_id: { id: fileId },
                }))
            : [],
          update: [],
          delete: deletedMediaGeneratedAiIds,
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
