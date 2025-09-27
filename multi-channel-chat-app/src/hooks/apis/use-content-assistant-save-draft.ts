import { useState, useCallback } from "react";
import { toast } from "@/components/snackbar";
import { updateContentAssistant } from "@/actions/content-assistant";
import { uploadFile } from "@/actions/upload";
import { Content } from '@/sections/content-assistant/view/content-assistant-list-view';

type MediaGeneratedAiItem = {
  id?: number;
  directus_files_id?: string;
  [key: string]: unknown;
};

export interface UseContentAssistantSaveDraftProps {
  watchMethod: (() => Record<string, unknown>) | null;
  activeStep: number;
  editData?: Content;
}

interface UseContentAssistantSaveDraftReturn {
  isSavingDraft: boolean;
  handleSaveDraft: () => Promise<void>;
}

interface FileWithApiProperties {
  id?: string;
  idItem?: string;
  path?: string;
  [key: string]: unknown;
}



interface EditDataRelationItem {
  customer_journey_id?: { id: number; name?: string };
  customer_group_id?: { id: number; name?: string };
  ai_rule_based_id?: { id: number; name?: string };
  content_tone_id?: { id: number; name?: string };
  omni_channels_id?: { id: number; name?: string };
  id?: number;
}

export function useContentAssistantSaveDraft({
  watchMethod,
  activeStep,
  editData
}: UseContentAssistantSaveDraftProps): UseContentAssistantSaveDraftReturn {
  const [isSavingDraft, setIsSavingDraft] = useState(false);

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

      // Helper function to get items to create for relation fields
      const getItemsToCreate = (
        currentIds: number[],
        existingItems: EditDataRelationItem[],
        relationKey: keyof EditDataRelationItem,
        aiContentSuggestionsId: string
      ) => {
        if (!Array.isArray(currentIds)) return [];
        
        return currentIds
          .filter(id => {
            return !existingItems.some((item: EditDataRelationItem) => {
              const relationValue = item[relationKey];
              return typeof relationValue === 'object' && relationValue !== null && 'id' in relationValue 
                ? relationValue.id === id
                : false;
            });
          })
          .map(id => ({
            ai_content_suggestions_id: aiContentSuggestionsId,
            [relationKey]: { id }
          }));
      };

      // Helper function to get items to delete for relation fields
      const getItemsToDelete = (
        currentIds: number[],
        existingItems: EditDataRelationItem[]
      ): number[] => {
        if (!Array.isArray(existingItems)) return [];
        if (!Array.isArray(currentIds)) {
          return existingItems.map((item: EditDataRelationItem) => item.id).filter(Boolean) as number[];
        }
        
        return existingItems
          .filter((item: EditDataRelationItem) => {
            const relationId = item.customer_journey_id?.id || 
                             item.customer_group_id?.id || 
                             item.ai_rule_based_id?.id || 
                             item.content_tone_id?.id;
            return relationId && !currentIds.includes(relationId);
          })
          .map((item: EditDataRelationItem) => item.id)
          .filter(Boolean) as number[];
      };

      // Helper function to get items to create for omni_channels
      const getOmniChannelsItemsToCreate = (
        currentIds: number[],
        existingItems: { omni_channels_id: number }[],
        aiContentSuggestionsId: string
      ) => {
        if (!Array.isArray(currentIds)) return [];
        
        return currentIds
          .filter(id => {
            return !existingItems.some((item: { omni_channels_id: number }) => {
              return item.omni_channels_id === id;
            });
          })
          .map(id => ({
            ai_content_suggestions_id: aiContentSuggestionsId,
            omni_channels_id: { id }
          }));
      };

      // Helper function to get items to delete for omni_channels
      const getOmniChannelsItemsToDelete = (
        currentIds: number[],
        existingItems: { omni_channels_id: number; id: number }[]
      ): number[] => {
        if (!Array.isArray(existingItems)) return [];
        if (!Array.isArray(currentIds)) {
          return existingItems.map((item: { id: number }) => item.id).filter(Boolean) as number[];
        }
        
        return existingItems
          .filter((item: { omni_channels_id: number }) => {
            return !currentIds.includes(item.omni_channels_id);
          })
          .map((item: { id: number }) => item.id)
          .filter(Boolean) as number[];
      };

      // Compare current media with currentFormData.media to find new files
      const getNewMediaFiles = (
        currentMedia: (File | FileWithApiProperties)[],
        originalMedia: FileWithApiProperties[]
      ): (File | FileWithApiProperties)[] => {
        if (!Array.isArray(currentMedia)) return [];
        if (!Array.isArray(originalMedia)) return currentMedia;

        return currentMedia.filter((currentFile) => {
          // If it's a File object, it's new
          if (currentFile instanceof File) {
            return true;
          }
          
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
        currentMedia: (File | FileWithApiProperties)[],
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
              (currentFile) => {
                if (currentFile instanceof File) return false;
                return currentFile.path === originalFile.path;
              }
            );
          })
          .map((file) => file.idItem)
          .filter(Boolean) as string[];
      };

      // Find deleted media_generated_ai items
      const getDeletedMediaGeneratedAiFiles = (
        currentMediaGeneratedAi: (string | MediaGeneratedAiItem)[],
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

      const currentMedia = (currentFormData.media as (File | FileWithApiProperties)[]) || [];
      const newMediaFiles = getNewMediaFiles(
        currentMedia,
        editData?.media as unknown as FileWithApiProperties[] || []
      );

      const deletedMediaIds = getDeletedMediaFiles(
        currentMedia,
        editData?.media as unknown as FileWithApiProperties[] || []
      );

      const deletedMediaGeneratedAiIds = getDeletedMediaGeneratedAiFiles(
        (currentFormData.media_generated_ai as (string | MediaGeneratedAiItem)[]) || [],
        (editData?.media_generated_ai as unknown as MediaGeneratedAiItem[]) || []
      );

      let mediaArray: Array<{ id: string }> = [];
      if (newMediaFiles.length > 0) {
        // Filter only File objects for upload
        const filesToUpload = newMediaFiles.filter((file): file is File => file instanceof File);
        if (filesToUpload.length > 0) {
          mediaArray = await uploadMediaFiles(filesToUpload);
        }
      }
      console.log('mediaArray', mediaArray)

      // Get AI content suggestions ID as string
      const aiContentSuggestionsId = (currentFormData.id as number).toString();

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
          create: getItemsToCreate(
            currentFormData.customer_group as number[],
            (editData?.customer_group as EditDataRelationItem[]) || [],
            'customer_group_id',
            aiContentSuggestionsId
          ),
          update: [],
          delete: getItemsToDelete(
            currentFormData.customer_group as number[],
            (editData?.customer_group as EditDataRelationItem[]) || []
          ),
        },
        customer_journey: {
          create: getItemsToCreate(
            currentFormData.customer_journey ? [currentFormData.customer_journey as number] : [],
            (editData?.customer_journey as EditDataRelationItem[]) || [],
            'customer_journey_id',
            aiContentSuggestionsId
          ),
          update: [],
          delete: getItemsToDelete(
            currentFormData.customer_journey ? [currentFormData.customer_journey as number] : [],
            (editData?.customer_journey as EditDataRelationItem[]) || []
          ),
        },
        ai_rule_based: {
          create: getItemsToCreate(
            currentFormData.ai_rule_based as number[],
            (editData?.ai_rule_based as EditDataRelationItem[]) || [],
            'ai_rule_based_id',
            aiContentSuggestionsId
          ),
          update: [],
          delete: getItemsToDelete(
            currentFormData.ai_rule_based as number[],
            (editData?.ai_rule_based as EditDataRelationItem[]) || []
          ),
        },
        content_tone: {
          create: getItemsToCreate(
            currentFormData.content_tone as number[],
            (editData?.content_tone as EditDataRelationItem[]) || [],
            'content_tone_id',
            aiContentSuggestionsId
          ),
          update: [],
          delete: getItemsToDelete(
            currentFormData.content_tone as number[],
            (editData?.content_tone as EditDataRelationItem[]) || []
          ),
        },
        omni_channels: {
          create: getOmniChannelsItemsToCreate(
            currentFormData.omni_channels as number[],
            (editData?.omni_channels as { omni_channels_id: number }[]) || [],
            aiContentSuggestionsId
          ),
          update: [],
          delete: getOmniChannelsItemsToDelete(
            currentFormData.omni_channels as number[],
            (editData?.omni_channels as { omni_channels_id: number; id: number }[]) || []
          ),
        },
        media: {
          create: mediaArray.map((item) => ({
            ai_content_suggestions_id: currentFormData.id,
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
                  ai_content_suggestions_id: currentFormData.id,
                  directus_files_id: { id: fileId },
                }))
            : [],
          update: [],
          delete: deletedMediaGeneratedAiIds,
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
  }, [watchMethod, activeStep, editData]);

  return {
    isSavingDraft,
    handleSaveDraft,
  };
}