import * as zod from "zod";
import { POST_STATUS, POST_STEP, POST_TYPE } from "@/constants/auto-post";
import { uploadFile } from "@/actions/upload";
import { CONFIG } from "@/config-global";
import { ContentAssistantApiResponse } from "@/actions/content-assistant";
import { Content } from "@/sections/content-assistant/view/content-assistant-list-view";
import { CONTENT_STEP_TO_START_STEP } from "@/constants/content-assistant-steps";

// Type definitions
export interface MediaGeneratedAiItem {
  id?: number;
  ai_content_suggestions_id?: number;
  directus_files_id?: string;
}

export interface FileWithApiProperties {
  path?: string;
  idItem?: string;
  [key: string]: unknown;
}

// Schema definition
const ContentSchema = zod.object({
  // fields not in form
  status: zod.string().default(POST_STATUS.DRAFT),
  id: zod.number().nullable().default(null),

  // Step 1: Research & Analysis
  topic: zod.string().min(1, { message: "Chủ đề là bắt buộc!" }),
  post_type: zod.string().min(1, { message: "Loại bài viết là bắt buộc!" }),
  main_seo_keyword: zod
    .string()
    .min(1, { message: "Từ khoá SEO chính là bắt buộc!" }),
  secondary_seo_keywords: zod.string().array().default([]),
  customer_group: zod.number().array().min(1, "Nhóm khách hàng là bắt buộc"),
  services: zod.number().array().min(1, "Dịch vụ là bắt buộc"),
  customer_journey: zod.number({
    required_error: "Hành trình khách hàng là bắt buộc",
  }),
  ai_rule_based: zod.number().array().default([]),
  content_tone: zod.number().array().default([]),
  ai_notes_make_outline: zod.string().default(""),
  omni_channels: zod
    .number()
    .array()
    .min(1, { message: "Omni channel là bắt buộc" }),

  // step Make Outline
  outline_post: zod.string().min(1, { message: "Dàn ý không được để trống" }),
  post_goal: zod.string().min(1, { message: "Mục tiêu không được để trống" }),
  post_notes: zod.string().default(""),
  ai_notes_write_article: zod.string().default(""),

  // step Write Article
  post_content: zod.string().default(""),
  ai_notes_create_image: zod.string().default(""),
  media: zod.array(zod.any()).default([]),
  video: zod.array(zod.any()).default([]),
  media_generated_ai: zod.array(zod.any()).default([]),
  is_generated_by_AI: zod.boolean().default(false),

  // step HTML Coding
  ai_notes_html_coding: zod.string().default(""),
  post_html_format: zod.string().default(""),
});

export type FormData = zod.infer<typeof ContentSchema>;
export { ContentSchema };

export const getFieldsForStep = (step: string): (keyof FormData)[] => {
  switch (step) {
    case POST_STEP.RESEARCH_ANALYSIS:
      return [
        "topic",
        "post_type",
        "main_seo_keyword",
        "customer_group",
        "services",
        "customer_journey",
        "omni_channels",
        "video",
      ];
    case POST_STEP.MAKE_OUTLINE:
      return [
        "outline_post",
        "post_goal",
        "post_notes",
        "ai_notes_write_article",
      ];
    case POST_STEP.WRITE_ARTICLE:
      return ["post_content", "ai_notes_create_image", "media"];
    case POST_STEP.HTML_CODING:
      return ["post_html_format", "ai_notes_html_coding"];
    default:
      return [];
  }
};

export const getDefaultValues = (
  editData?: Content | ContentAssistantApiResponse | null
): Partial<FormData> => {
  if (editData) {
    // Helper function to safely extract IDs from relation arrays
    const extractIds = (items: unknown): number[] => {
      if (!Array.isArray(items)) return [];
      return items
        .map((item) => {
          if (typeof item === "number") return item;
          if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>;
            if (obj.id && typeof obj.id === "number") return obj.id;
            if (
              obj.customer_group_id &&
              typeof obj.customer_group_id === "object"
            ) {
              const nested = obj.customer_group_id as Record<string, unknown>;
              if (nested.id && typeof nested.id === "number") return nested.id;
            }
            if (
              obj.customer_journey_id &&
              typeof obj.customer_journey_id === "object"
            ) {
              const nested = obj.customer_journey_id as Record<string, unknown>;
              if (nested.id && typeof nested.id === "number") return nested.id;
            }
            if (
              obj.services_id &&
              typeof obj.services_id === "object"
            ) {
              const nested = obj.services_id as Record<string, unknown>;
              if (nested.id && typeof nested.id === "number") return nested.id;
            }
            if (
              obj.content_tone_id &&
              typeof obj.content_tone_id === "object"
            ) {
              const nested = obj.content_tone_id as Record<string, unknown>;
              if (nested.id && typeof nested.id === "number") return nested.id;
            }
            if (
              obj.ai_rule_based_id &&
              typeof obj.ai_rule_based_id === "object"
            ) {
              const nested = obj.ai_rule_based_id as Record<string, unknown>;
              if (nested.id && typeof nested.id === "number") return nested.id;
            }
            if (obj.omni_channels_id) {
              if (typeof obj.omni_channels_id === "number") {
                return obj.omni_channels_id;
              }
              if (typeof obj.omni_channels_id === "object") {
                const nested = obj.omni_channels_id as Record<string, unknown>;
                if (nested.id && typeof nested.id === "number") return nested.id;
              }
            }
          }
          return 0;
        })
        .filter((id) => id > 0);
    };

    // Helper function to safely get string value
    const getString = (value: unknown): string => {
      return typeof value === "string" ? value : "";
    };

    // Helper function to safely get array value
    const getArray = (value: unknown): unknown[] => {
      return Array.isArray(value) ? value : [];
    };

    const apiData = editData as Record<string, unknown>;

    return {
      id: editData.id ? Number(editData.id) : null,
      // Step 1
      topic: editData.topic || "",
      post_type: editData.post_type || POST_TYPE.FACEBOOK_POST,
      main_seo_keyword: editData.main_seo_keyword || "",
      secondary_seo_keywords: editData.secondary_seo_keywords || [],
      customer_group:
        extractIds(editData.customer_group).length > 0
          ? extractIds(editData.customer_group)
          : [],
      services:
        extractIds(editData.services).length > 0
          ? extractIds(editData.services)
          : [],
      customer_journey:
        extractIds(editData.customer_journey).length > 0
          ? extractIds(editData.customer_journey)[0]
          : undefined,
      content_tone:
        extractIds(editData.content_tone).length > 0
          ? extractIds(editData.content_tone)
          : [],
      ai_rule_based:
        extractIds(editData.ai_rule_based).length > 0
          ? extractIds(editData.ai_rule_based)
          : [],
      ai_notes_make_outline: getString(apiData.ai_notes_make_outline),
      status: editData.status || (POST_STATUS.DRAFT as string),
      omni_channels:
        extractIds(editData.omni_channels).length > 0
          ? extractIds(editData.omni_channels)
          : [],
      // Step 2
      outline_post: getString(apiData.outline_post),
      post_goal: getString(apiData.post_goal),
      post_notes: getString(apiData.post_notes),
      ai_notes_write_article: getString(apiData.ai_notes_write_article),
      // Step 3
      post_content: getString(apiData.post_content),
      ai_notes_create_image: getString(apiData.ai_notes_create_image),
      media: getArray(editData.media),
      video: apiData.video ? [apiData.video] : [],
      media_generated_ai: getArray(editData.media_generated_ai),
      // Step 4 - HTML Coding
      ai_notes_html_coding: getString(apiData.ai_notes_html_coding),
      post_html_format: getString(apiData.post_html_format),
    };
  }

  return {
    id: null,
    // Step 1
    topic: "",
    post_type: POST_TYPE.FACEBOOK_POST,
    main_seo_keyword: "",
    secondary_seo_keywords: [],
    customer_group: [],
    services: [],
    customer_journey: undefined,
    content_tone: [],
    ai_rule_based: [],
    ai_notes_make_outline: "",
    status: POST_STATUS.DRAFT as string,
    omni_channels: [],
    // Step 3 - Initialize media fields as empty arrays
    media: [],
    video: [],
    media_generated_ai: [],
    ai_notes_create_image: "",
    post_content: "",
  };
};

export const getStep1FormData = (formData: FormData) => {
  return {
    topic: formData.topic,
    post_type: formData.post_type,
    main_seo_keyword: formData.main_seo_keyword,
    secondary_seo_keywords: formData.secondary_seo_keywords,
    customer_group: formData.customer_group,
    services: formData.services,
    customer_journey: formData.customer_journey,
    content_tone: formData.content_tone,
    ai_rule_based: formData.ai_rule_based,
    ai_notes_make_outline: formData.ai_notes_make_outline,
    omni_channels: formData.omni_channels,
    video: formData.video,
  };
};

export const buildStepOutlineData = (formData: FormData) => {
  return {
    current_step: POST_STEP.MAKE_OUTLINE,
    outline_post: formData.outline_post,
    post_goal: formData.post_goal,
    post_notes: formData.post_notes || "",
    ai_notes_write_article: formData.ai_notes_write_article || "",
    is_generated_by_AI: false,
  };
};

export const buildStepWriteArticleData = async (
  formData: FormData,
  editData?: {
    media?: FileWithApiProperties[];
    media_generated_ai?: MediaGeneratedAiItem[];
    id?: string;
  },
  excludeMedia = false,
) => {
  // Process media data for upload and deletion only if not excluding media
  let mediaArray: Array<{ id: string }> = [];
  let deletedMediaIds: string[] = [];
  let deletedMediaGeneratedAiIds: string[] = [];
  let videoId = null;

  if (!excludeMedia) {
    const processedData = await processMediaDataForUpdate(formData, editData);
    mediaArray = processedData.mediaArray;
    deletedMediaIds = processedData.deletedMediaIds;
    deletedMediaGeneratedAiIds = processedData.deletedMediaGeneratedAiIds;
    videoId = processedData.videoId;
  }

  const result: Record<string, unknown> = {
    is_generated_by_AI: formData?.is_generated_by_AI || false,
    current_step: POST_STEP.WRITE_ARTICLE,
    post_content: formData.post_content || "",
    ai_notes_create_image: formData.ai_notes_create_image || "",
  };

  // Only include media fields if not excluding media
  if (!excludeMedia) {
    result.media = {
      create: mediaArray.map((item) => ({
        ai_content_suggestions_id: editData?.id || formData.id,
        directus_files_id: { id: item.id },
      })),
      update: [],
      delete: deletedMediaIds,
    };
    result.video = videoId;
    result.media_generated_ai = {
      // create: Array.isArray(formData.media_generated_ai)
      //   ? formData.media_generated_ai
      //       .filter((item: string | MediaGeneratedAiItem) => {
      //         // Include all string items (new generated images)
      //         if (typeof item === "string") {
      //           return true;
      //         }
      //         return false; // Don't include existing objects in create
      //       })
      //       .map((fileId: string) => ({
      //         ai_content_suggestions_id: editData?.id || formData.id,
      //         directus_files_id: { id: fileId },
      //       }))
      //   : [],
      create: [], // ảnh AI tạo ra đã được lưu ở n8n
      update: [],
      delete: deletedMediaGeneratedAiIds,
    };
  }

  return result;
};

// Helper function to upload files
export const uploadFiles = async (
  files: File[]
): Promise<Array<{ id: string; url: string }>> => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map(async (file: File) => {
    const uploadResponse = await uploadFile(file);
    return {
      id: uploadResponse.data.id,
      url: `${CONFIG.serverUrl}/admin/files/${uploadResponse.data.id}`,
    };
  });

  return await Promise.all(uploadPromises);
};

// Helper function to get deleted media files
export const getDeletedMediaFiles = (
  currentMedia: (File | FileWithApiProperties)[],
  originalMedia: FileWithApiProperties[]
): string[] => {
  if (!Array.isArray(originalMedia)) return [];
  if (!Array.isArray(currentMedia))
    return originalMedia.map((file) => file.idItem).filter(Boolean) as string[];

  // Get only the FileWithApiProperties from currentMedia (existing files)
  const currentApiFiles = currentMedia.filter(
    (file): file is FileWithApiProperties => !(file instanceof File)
  );

  // Count new File objects being added
  const newFileCount = currentMedia.filter(file => file instanceof File).length;

  // Special handling when all current media are new File objects
  if (currentApiFiles.length === 0 && newFileCount > 0) {
    // If we have the same number of files and all are new File objects,
    // it could be a pure addition scenario (originalMedia.length < currentMedia.length)
    // or a replacement scenario (originalMedia.length === currentMedia.length)
    if (originalMedia.length < currentMedia.length) {
      return [];
    }
  }

  // Special case: if originalMedia contains File objects (from form data),
  // we need to extract their properties differently
  const processedOriginalMedia = originalMedia.map((file) => {
    if (file instanceof File) {
      // If it's a File object, try to extract idItem from custom properties
      const fileWithProps = file as File & { idItem?: string; path?: string };
      const processed = {
        path: fileWithProps.path || fileWithProps.name,
        idItem: fileWithProps.idItem
      };
      return processed;
    }
    return file;
  });

  if (currentApiFiles.length === 0 && newFileCount > 0) {
    const currentFileNames = currentMedia.map(file => {
      if (file instanceof File) {
        const fileWithProps = file as File & { path?: string; idItem?: string };
        return fileWithProps.path || file.name;
      }
      return file.path;
    });
    
    return processedOriginalMedia
      .filter((originalFile) => {
        const isFromApi = 
          (originalFile.path && originalFile.path.startsWith("image-")) ||
          originalFile.idItem;
        if (!isFromApi) return false;

        const stillExists = currentFileNames.includes(originalFile.path);
        return !stillExists;
      })
      .map((file) => file.idItem)
      .filter(Boolean) as string[];
  }

  return processedOriginalMedia
    .filter((originalFile) => {
      const isFromApi = 
        (originalFile.path && originalFile.path.startsWith("image-")) ||
        originalFile.idItem;
      if (!isFromApi) return false;

      return !currentApiFiles.some((currentFile) => {
        return currentFile.idItem === originalFile.idItem;
      });
    })
    .map((file) => file.idItem)
    .filter(Boolean) as string[];
};

export const getDeletedMediaGeneratedAiFiles = (
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
      return !currentMediaGeneratedAi.some((currentItem) => {
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

// Helper function to get new media files that need to be uploaded
export const getNewMediaFiles = (
  currentMedia: (File | FileWithApiProperties)[],
  originalMedia: FileWithApiProperties[]
): File[] => {
  if (!Array.isArray(currentMedia)) return [];

  return currentMedia.filter((file): file is File => {
    // Only include File objects (new uploads)
    if (!(file instanceof File)) return false;

    // Check if this is a transformed media file (has idItem property)
    // These are existing media files that were transformed from API data
    if ('idItem' in file && file.idItem) {
      return false; // Exclude transformed media files from upload
    }

    // Check if this file is not in the original media
    return !originalMedia.some((originalFile) => {
      // Compare by file name and size if available
      return originalFile.path === file.name;
    });
  });
}

// Helper function to process media data for API update
export const processMediaDataForUpdate = async (
  formData: FormData,
  editData?: {
    media?: FileWithApiProperties[];
    media_generated_ai?: MediaGeneratedAiItem[];
  }
) => {
  const currentMedia = (formData.media as (File | FileWithApiProperties)[]) || [];
  const newMediaFiles = getNewMediaFiles(
    currentMedia,
    editData?.media || []
  );
  const deletedMediaIds = getDeletedMediaFiles(
    currentMedia,
    editData?.media || []
  );
  const deletedMediaGeneratedAiIds = getDeletedMediaGeneratedAiFiles(
    (formData.media_generated_ai as (string | MediaGeneratedAiItem)[]) || [],
    (editData?.media_generated_ai as MediaGeneratedAiItem[]) || []
  );

  let mediaArray: Array<{ id: string }> = [];
  if (newMediaFiles.length > 0) {
    // Filter only File objects for upload
    const filesToUpload = newMediaFiles.filter(
      (file): file is File => file instanceof File
    );
    if (filesToUpload.length > 0) {
      const uploadResults = await uploadFiles(filesToUpload);
      mediaArray = uploadResults.map((result) => ({ id: result.id }));
    }
  }

  // Handle video upload separately - simple logic like original
  let videoId: string | null = null;
  if (Array.isArray(formData.video) && formData.video.length > 0) {
    const videoFile = formData.video[0];
    if (videoFile instanceof File) {
      const videoUploadResult = await uploadFile(videoFile);
      videoId = videoUploadResult.data.id;
    }
  }

  return {
    mediaArray,
    deletedMediaIds,
    deletedMediaGeneratedAiIds,
    videoId,
  };
};

// Helper function to check if form data has changed
export const hasFormDataChanged = (
  currentData: FormData,
  initialData: FormData | null,
  step?: string
) => {
  if (!currentData.id || !initialData) {
    return false; // No comparison needed for new records
  }

  // Get fields to compare based on step
  let fieldsToCompare: (keyof FormData)[];

  if (step === POST_STEP.MAKE_OUTLINE) {
    fieldsToCompare = [
      "outline_post",
      "post_goal",
      "post_notes",
      "ai_notes_write_article",
    ];
  } else if (step === POST_STEP.WRITE_ARTICLE) {
    fieldsToCompare = [
      "post_content",
      "ai_notes_create_image",
      "media",
      "video",
      "media_generated_ai",
      "is_generated_by_AI",
    ];
  } else if (step === POST_STEP.HTML_CODING) {
    fieldsToCompare = [
      "ai_notes_html_coding",
      "post_html_format",
    ];
  } else {
    // Default to RESEARCH_ANALYSIS fields
    fieldsToCompare = [
      "topic",
      "post_type",
      "main_seo_keyword",
      "secondary_seo_keywords",
      "customer_group",
      "customer_journey",
      "ai_rule_based",
      "content_tone",
      "ai_notes_make_outline",
      "omni_channels",
      "video",
    ];
  }

  return fieldsToCompare.some((field) => {
    const current = currentData[field];
    const initial = initialData[field];

    // Handle array comparison
    if (Array.isArray(current) && Array.isArray(initial)) {
      return JSON.stringify(current.sort()) !== JSON.stringify(initial.sort());
    }

    return current !== initial;
  });
};

export const buildStepResearchData = async (formData: FormData, isCreate = false) => {
  // Handle video upload if present
  let videoId = null;
  if (Array.isArray(formData.video) && formData.video.length > 0) {
    const videoFile = formData.video[0];
    if (videoFile instanceof File) {
      const videoUploadResult = await uploadFile(videoFile);
      videoId = videoUploadResult.data.id;
    } else if (typeof videoFile === 'string') {
      videoId = videoFile;
    }
  }

  if (isCreate) {
    // Remove duplicates from arrays before mapping
    const uniqueAiRuleBased = [...new Set(formData.ai_rule_based || [])];
    const uniqueContentTone = [...new Set(formData.content_tone || [])];
    const uniqueOmniChannels = [...new Set(formData.omni_channels || [])];
    
    // Format for create API
    return {
      current_step: POST_STEP.RESEARCH_ANALYSIS,
      post_type: formData.post_type,
      topic: formData.topic,
      main_seo_keyword: formData.main_seo_keyword,
      secondary_seo_keywords: formData.secondary_seo_keywords || [],
      is_generated_by_AI: false,
      ai_notes_make_outline: formData.ai_notes_make_outline || "",
      video: videoId,
      ai_rule_based: {
        create: uniqueAiRuleBased.map((id) => ({
          ai_content_suggestions_id: "+",
          ai_rule_based_id: { id },
        })),
        update: [],
        delete: [],
      },
      content_tone: {
        create: uniqueContentTone.map((id) => ({
          ai_content_suggestions_id: "+",
          content_tone_id: { id },
        })),
        update: [],
        delete: [],
      },
      omni_channels: {
        create: uniqueOmniChannels.map((id) => ({
          ai_content_suggestions_id: "+",
          omni_channels_id: { id },
        })),
        update: [],
        delete: [],
      },
      customer_journey: {
        create: formData.customer_journey ? [{
          ai_content_suggestions_id: "+",
          customer_journey_id: { id: formData.customer_journey },
        }] : [],
        update: [],
        delete: [],
      },
      customer_group: {
        create: (formData.customer_group || []).map((id) => ({
          ai_content_suggestions_id: "+",
          customer_group_id: { id },
        })),
        update: [],
        delete: [],
      },
      services: {
        create: (formData.services || []).map((id: number) => ({
          ai_content_suggestions_id: "+",
          services_id: { id },
        })),
        update: [],
        delete: [],
      },
    };
  }

  // Format for update API (existing format)
  return {
    current_step: POST_STEP.RESEARCH_ANALYSIS,
    topic: formData.topic,
    post_type: formData.post_type,
    main_seo_keyword: formData.main_seo_keyword,
    secondary_seo_keywords: formData.secondary_seo_keywords || [],
    video: videoId,
    customer_group:
      formData.customer_group?.map((item) => ({
        customer_group_id: item,
      })) || [],
    services:
      formData.services?.map((item: number) => ({
        services_id: item,
      })) || [],
    customer_journey: formData.customer_journey ? [{
      customer_journey_id: formData.customer_journey,
    }] : [],
    ai_rule_based:
      formData.ai_rule_based?.map((item) => ({
        ai_rule_based_id: item,
      })) || [],
    content_tone:
      formData.content_tone?.map((item) => ({
        content_tone_id: item,
      })) || [],
    ai_notes_make_outline: formData.ai_notes_make_outline,
    status: formData.status || POST_STATUS.DRAFT,
    omni_channels: formData.omni_channels?.map((item) => ({
      omni_channels_id: item,
    })),
  };
};

// Get startStep based on current_step
export const getStartStepFromCurrentStep = (currentStep?: string): number => {
  if (!currentStep) return 1; // Default to research step
  return CONTENT_STEP_TO_START_STEP[currentStep] || 1;
};

export const transformMediaItems = (mediaItems: MediaGeneratedAiItem[]): File[] => {
  return mediaItems.map((mediaItem: MediaGeneratedAiItem) => {
    const imageUrl = `${CONFIG.serverUrl}/assets/${mediaItem.directus_files_id}`;
    // Create a File-like object that RHFUpload can handle
    const file = new File([], `image-${mediaItem.id}`, {
      type: "image/jpeg",
    });
    // Add custom properties for preview
    Object.defineProperty(file, "preview", {
      value: imageUrl,
      writable: false,
    });
    Object.defineProperty(file, "idItem", {
      value: mediaItem.id,
      writable: false,
    });
    Object.defineProperty(file, "path", {
      value: `image-${mediaItem.id}`,
      writable: false,
    });
    return file;
  });
};

export const buildStepHtmlCodingData = (formData: FormData) => {
  return {
    ai_notes_html_coding: formData.ai_notes_html_coding,
    post_html_format: formData.post_html_format,
    current_step: POST_STEP.HTML_CODING,
  };
};