import { POST_TYPE } from "@/constants/auto-post";
import {
    CAMPAIGN_STATUS,
    CAMPAIGN_STEP_KEY,
  } from "@/constants/marketing-compaign";
import * as zod from "zod";
import { CampaignApiData, CampaignStep1Data, CampaignStep2Data, CampaignStep3Data } from "../types";
import { Campaign } from "@/types/campaign";

// Schema definition
const CampaignSchema = zod.object({
  // fields not in form
  id: zod.number().nullable().default(null),
  current_step: zod.string().default(CAMPAIGN_STEP_KEY.CAMPAIGN_INFO),

  // Step 1: Campaign Info
  name: zod.string().min(1, "Tên chiến dịch là bắt buộc"),
  status: zod.string().default(CAMPAIGN_STATUS.TODO),
  target_post_count: zod.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) {
        return undefined;
      }
      return Number(val);
    },
    zod.number({
      required_error:"Số lượng mục tiêu bài viết là bắc buộc"
    }).int().min(1, "Số lượng mục tiêu bài viết phải lớn hơn 0")
  ),
  start_date: zod.date().nullable().default(null),
  end_date: zod.date().nullable().default(null),
  post_type: zod.string().default(POST_TYPE.FACEBOOK_POST),
  customer_group: zod.number().array().min(1, "Nhóm khách hàng là bắt buộc"),
  services: zod.number().array().min(1, "Dịch vụ là bắt buộc"),
  omni_channels: zod.number({
    required_error: "Omni channel là bắt buộc",
  }),
  post_topic: zod.string().min(1, "Chủ đề bài đăng là bắt buộc"),
  objectives: zod.string().min(1, "Mục tiêu là bắt buộc"),
  description: zod.string().optional(),
  ai_create_post_info_notes: zod.string().default(""),

  // Step 2: Post Content Info
  main_seo_keyword: zod
    .string()
    .min(1, { message: "Từ khoá SEO chính là bắt buộc!" }),
  secondary_seo_keywords: zod.string().array().default([]),
  customer_journey: zod.number({
    required_error: "Hành trình khách hàng là bắt buộc",
  }),
  content_tone: zod.number().array().default([]),
  ai_rule_based: zod.number().array().default([]),
  ai_create_post_list_notes: zod.string(),
  need_create_post_amount: zod.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) {
        return undefined;
      }
      return Number(val);
    },
    zod.number({required_error: "Số lượng bài viết cần tạo là bắt buộc"}).int().min(0, "Số lượng bài viết cần tạo phải lớn hơn hoặc bằng 0")
  ),
  post_notes: zod.string().default(""),

  // Step 3: Create Post List
  ai_create_post_detail_notes: zod.string(),
  ai_content_suggestions: zod.string().array().default([]),
});

export type CampaignFormData = zod.infer<typeof CampaignSchema>;
export { CampaignSchema };

// Date validation utility function
export const validateDateRange = (
  startDate: Date | null,
  endDate: Date | null,
  setError: (field: "start_date" | "end_date", error: { type: string; message: string }) => void,
  clearErrors: (fields?: ("start_date" | "end_date") | ("start_date" | "end_date")[]) => void
) => {
  if (startDate && endDate) {
    // Kiểm tra nếu ngày bắt đầu lớn hơn ngày kết thúc
    if (startDate > endDate) {
      setError("end_date", {
        type: "manual",
        message: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
      });
      // Clear error on start_date if any
      clearErrors("start_date");
    } 
    // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu (trường hợp ngược lại)
    else if (endDate < startDate) {
      setError("start_date", {
        type: "manual", 
        message: "Ngày bắt đầu phải trước ngày kết thúc",
      });
      // Clear error on end_date if any
      clearErrors("end_date");
    } 
    // Nếu dates hợp lệ, clear tất cả errors
    else {
      clearErrors(["start_date", "end_date"]);
    }
  } else {
    // Nếu thiếu một trong hai dates, clear errors
    clearErrors(["start_date", "end_date"]);
  }
};

// Debounced date validation utility function
export const createDebouncedDateValidation = (
  startDate: Date | null,
  endDate: Date | null,
  setError: (field: "start_date" | "end_date", error: { type: string; message: string }) => void,
  clearErrors: (fields?: ("start_date" | "end_date") | ("start_date" | "end_date")[]) => void,
  formState: { errors: Record<string, unknown> },
  debounceMs: number = 100
) => {
  const timeoutId = setTimeout(() => {
    validateDateRange(startDate, endDate, setError, clearErrors);
  }, debounceMs);

  return () => clearTimeout(timeoutId);
};

// Utility function to check if date validation passes for handleNext
export const isDateRangeValid = (
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  // If both dates are null, consider it valid (no date range set)
  if (!startDate && !endDate) {
    return true;
  }

  // If only one date is set, consider it valid (partial date range)
  if (!startDate || !endDate) {
    return true;
  }

  // Both dates are set, check if start_date <= end_date
  return startDate <= endDate;
};

export const getFieldsForStep = (step: string): (keyof CampaignFormData)[] => {
  switch (step) {
    case CAMPAIGN_STEP_KEY.CAMPAIGN_INFO:
      return [
        "name",
        "customer_group",
        "services",
        "omni_channels",
        "post_topic",
        "objectives",
        "description",
        "status",
        "start_date",
        "end_date",
        "target_post_count",
        "post_type",
        "ai_create_post_info_notes",
      ];
    case CAMPAIGN_STEP_KEY.POST_CONTENT_INFO:
      return [
        "main_seo_keyword",
        "customer_journey",
        "secondary_seo_keywords",
        "content_tone",
        "ai_rule_based",
        "need_create_post_amount",
        "ai_create_post_list_notes",
      ];
    case CAMPAIGN_STEP_KEY.CREATE_POST_LIST:
      return ["ai_create_post_detail_notes", "ai_content_suggestions"];
    default:
      return [];
  }
};



// Build campaign data for Step 1 creation only
export const buildCampaignDataStep1 = (formData: CampaignFormData): CampaignStep1Data => {
  return {
    current_step: CAMPAIGN_STEP_KEY.POST_CONTENT_INFO,
    name: formData.name,
    status: formData.status,
    target_post_count: formData.target_post_count,
    start_date: formData.start_date,
    end_date: formData.end_date,
    post_type: formData.post_type,
    post_topic: formData.post_topic,
    objectives: formData.objectives,
    description: formData.description || "",
    ai_create_post_info_notes: formData.ai_create_post_info_notes,
    customer_group: {
      create: (formData.customer_group || []).map((id: number) => ({
        campaign_id: "+",
        customer_group_id: { id },
      })),
      update: [],
      delete: [],
    },
    services: {
      create: (formData.services || []).map((id: number) => ({
        campaign_id: "+",
        services_id: { id },
      })),
      update: [],
      delete: [],
    },
    omni_channels: formData.omni_channels ? Number(formData.omni_channels) : undefined,
  };
};

// Build campaign data for Step 2 update only
export const buildCampaignDataStep2 = (formData: CampaignFormData, campaignId: string): CampaignStep2Data => {
  return {
    current_step: CAMPAIGN_STEP_KEY.CREATE_POST_LIST,
    main_seo_keyword: formData.main_seo_keyword,
    secondary_seo_keywords: formData.secondary_seo_keywords || [],
    customer_journey: {
      create: formData.customer_journey ? [{
        campaign_id: campaignId,
        customer_journey_id: { id: formData.customer_journey },
      }] : [],
      update: [],
      delete: [],
    },
    content_tone: {
      create: (formData.content_tone || []).map((id: number) => ({
        campaign_id: campaignId,
        content_tone_id: { id },
      })),
      update: [],
      delete: [],
    },
    ai_rule_based: {
      create: (formData.ai_rule_based || []).map((id: number) => ({
        campaign_id: campaignId,
        ai_rule_based_id: { id },
      })),
      update: [],
      delete: [],
    },
    post_notes: formData.post_notes || "",
    ai_create_post_list_notes: formData.ai_create_post_list_notes || "",
    need_create_post_amount: formData.need_create_post_amount || undefined,
  };
};

export const buildCampaignDataStep3 = (
  formData: CampaignFormData, 
  campaignId: string, 
  selectedContentSuggestions: (string | number)[]
): CampaignStep3Data => {
  return {
    status: CAMPAIGN_STATUS.IN_PROGRESS,
    ai_content_suggestions: {
      create: [],
      update: selectedContentSuggestions.map((id) => ({
        campaign: campaignId,
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      })),
      delete: [],
    },
  };
};

export const getDefaultValues = (
  editData?: Campaign | null
): Partial<CampaignFormData> => {
  // If editData is provided, transform it to form data
  if (editData) {
    return {
      id: editData.id,
      name: editData.name || "",
      status: editData.status || CAMPAIGN_STATUS.TODO,
      target_post_count: Number(editData.target_post_count) || undefined,
      start_date: editData.start_date ? new Date(editData.start_date) : new Date(),
      end_date: editData.end_date ? new Date(editData.end_date) : new Date(),
      post_type: editData.post_type || POST_TYPE.FACEBOOK_POST,
      customer_group: editData.customer_group?.map(cg => cg.customer_group_id?.id).filter(id => id !== undefined) || [],
      services: editData.services?.map(s => s.services_id?.id).filter(id => id !== undefined) || [],
      omni_channels: editData['38a0c536']?.id || editData['704a9f83'] ? 1 : 1,
      post_topic: editData.post_topic || "",
      objectives: editData.objectives || "",
      description: editData.description || "",
      ai_create_post_info_notes: "",
      
      main_seo_keyword: editData.main_seo_keyword || "",
      secondary_seo_keywords: editData.secondary_seo_keywords || [],
      customer_journey: editData.customer_journey?.[0]?.customer_journey_id?.id,
      content_tone: editData.content_tone?.map(ct => ct.content_tone_id?.id).filter(id => id !== undefined) || [],
      ai_rule_based: editData.ai_rule_based?.map(ar => ar.ai_rule_based_id?.id).filter(id => id !== undefined) || [],
      ai_create_post_list_notes: "",
      need_create_post_amount: editData.need_create_post_amount ? Number(editData.need_create_post_amount) : undefined,
      post_notes: "",
      
      ai_create_post_detail_notes: "",
      ai_content_suggestions: editData.ai_content_suggestions?.map(acs => acs.id?.toString()).filter(id => id !== undefined) || [],
    };
  }
  
  return {
    id: null,
    name: undefined,
    status: CAMPAIGN_STATUS.TODO,
    target_post_count: undefined,
    start_date: new Date(),
    end_date: new Date(),
    post_type: POST_TYPE.FACEBOOK_POST,
    customer_group: undefined,
    services: undefined,
    omni_channels: undefined,
    post_topic: undefined,
    objectives: undefined,
    description: undefined,
    ai_create_post_info_notes: undefined,

    main_seo_keyword: "",
    secondary_seo_keywords: [],
    customer_journey: undefined,
    content_tone: [],
    ai_rule_based: [],
    ai_create_post_list_notes: "",
    need_create_post_amount: undefined,
    post_notes: "",

    ai_create_post_detail_notes: "",
    ai_content_suggestions: [],
  };
};

export const buildCampaignData = (formData: CampaignFormData): CampaignApiData => {
  // Transform form data to match API expected format
  return {
    name: formData.name,
    status: formData.status,
    target_post_count: formData.target_post_count,
    start_date: formData.start_date,
    end_date: formData.end_date,
    post_type: formData.post_type,
    post_topic: formData.post_topic,
    objectives: formData.objectives,
    description: formData.description || "",
    ai_create_post_info_notes: formData.ai_create_post_info_notes,
    main_seo_keyword: formData.main_seo_keyword,
    secondary_seo_keywords: formData.secondary_seo_keywords,
    ai_create_post_list_notes: formData.ai_create_post_list_notes,
    need_create_post_amount: formData.need_create_post_amount,
    ai_create_post_detail_notes: formData.ai_create_post_detail_notes,
    customer_group: {
      create: (formData.customer_group || []).map((id: number) => ({
        campaign_id: "+",
        customer_group_id: { id },
      })),
      update: [],
      delete: [],
    },
    services: {
      create: (formData.services || []).map((id: number) => ({
        campaign_id: "+",
        services_id: { id },
      })),
      update: [],
      delete: [],
    },
    customer_journey: formData.customer_journey ? {
      create: [{
        campaign_id: "+",
        customer_journey_id: { id: formData.customer_journey },
      }],
      update: [],
      delete: [],
    } : {
      create: [],
      update: [],
      delete: [],
    },
    ai_rule_based: {
      create: (formData.ai_rule_based || []).map((id: number) => ({
        campaign_id: "+",
        ai_rule_based_id: { id },
      })),
      update: [],
      delete: [],
    },
    content_tone: {
      create: (formData.content_tone || []).map((id: number) => ({
        campaign_id: "+",
        content_tone_id: { id },
      })),
      update: [],
      delete: [],
    },
    omni_channels: formData.omni_channels ? {
      create: [{
        campaign_id: "+",
        omni_channels_id: { id: formData.omni_channels },
      }],
      update: [],
      delete: [],
    } : {
      create: [],
      update: [],
      delete: [],
    },
    ai_content_suggestions: {
      create: (formData.ai_content_suggestions || []).map((suggestion: string) => ({
        campaign_id: "+",
        ai_content_suggestion: suggestion,
        ai_create_post_detail_notes: formData.ai_create_post_detail_notes || "",
      })),
      update: [],
      delete: [],
    },
  };
};

// Utility functions for data comparison and caching
export const compareArrays = (arr1: unknown[], arr2: unknown[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

export const compareDates = (date1: Date | null, date2: Date | null): boolean => {
  if (date1 === null && date2 === null) return true;
  if (date1 === null || date2 === null) return false;
  return date1.getTime() === date2.getTime();
};

// Compare form data for specific step to detect changes
export const hasStepDataChanged = (
  currentData: CampaignFormData,
  cachedData: Partial<CampaignFormData> | null,
  step: string
): boolean => {
  if (!cachedData) return true;

  const fieldsToCompare = getFieldsForStep(step);
  
  return fieldsToCompare.some((field) => {
    const currentValue = currentData[field];
    const cachedValue = cachedData[field];

    // Handle array comparison
    if (Array.isArray(currentValue) && Array.isArray(cachedValue)) {
      return !compareArrays(currentValue, cachedValue);
    }

    // Handle date comparison
    if (currentValue instanceof Date || cachedValue instanceof Date) {
      return !compareDates(currentValue as Date | null, cachedValue as Date | null);
    }

    // Handle primitive values
    return currentValue !== cachedValue;
  });
};

// Extract data for specific step
export const extractStepData = (
  formData: CampaignFormData,
  step: string
): Partial<CampaignFormData> => {
  const fieldsForStep = getFieldsForStep(step);
  const stepData: Partial<CampaignFormData> = {};

  fieldsForStep.forEach((field) => {
    (stepData as Record<string, unknown>)[field] = formData[field];
  });

  return stepData;
};

// Transform campaign data to content assistant FormData format
export const transformCampaignToContentAssistant = (data: CampaignFormData) => {
  return {
    post_type: data.post_type || POST_TYPE.FACEBOOK_POST,
    topic: data.post_topic,
    main_seo_keyword: data.main_seo_keyword,
    secondary_seo_keywords: data.secondary_seo_keywords || [],
    customer_group: data.customer_group || [],
    services: data.services || [],
    customer_journey: data.customer_journey,
    content_tone: data.content_tone || [],
    ai_rule_based: data.ai_rule_based || [],
    ai_notes_make_outline: data.ai_create_post_list_notes || "",
    omni_channels: [data.omni_channels],
    video: [],
    // Required fields for FormData type
    id: null,
    status: CAMPAIGN_STATUS.TODO,
    outline_post: "",
    post_goal: "",
    post_notes: "",
    ai_notes_write_article: "",
    post_content: "",
    ai_notes_create_image: "",
    media: [],
    media_generated_ai: [],
    is_generated_by_AI: false,
  };
};
