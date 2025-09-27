import { POST_TYPE } from "@/constants/auto-post";
import {
  CAMPAIGN_STATUS,
  CAMPAIGN_STEP_KEY,
} from "@/constants/marketing-compaign";
import * as zod from "zod";

// Schema definition
const CampaignSchema = zod.object({
  // fields not in form
  id: zod.number().nullable().default(null),

  // Step 1: Campaign Info
  name: zod.string().min(1, "Tên chiến dịch là bắt buộc"),
  status: zod.string().default(CAMPAIGN_STATUS.TODO),
  target_post_count: zod.number({
    required_error:"Số lượng mục tiêu bài viết là bắc buộc"
  }),
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
  description: zod.string(),
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
  need_create_post_amount: zod.number({required_error: "Số lượng bài viết cần tạo là bắt buộc"}),

  // Step 3: Create Post List
  ai_content_suggestion: zod.string().array().default([]),
  ai_create_post_detail_notes: zod.string(),
});

export type CampaignFormData = zod.infer<typeof CampaignSchema>;
export { CampaignSchema };

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
      return ["ai_create_post_detail_notes"];
    default:
      return [];
  }
};

export const getDefaultValues = (
  editData?: null
): Partial<CampaignFormData> => {
  console.log('editData',editData)
  return {
    id: null,
    name: "Chiến dịch Bắc phạt",
    status: CAMPAIGN_STATUS.TODO,
    target_post_count: 2,
    start_date: new Date(),
    end_date: new Date(),
    post_type: POST_TYPE.FACEBOOK_POST,
    customer_group: [3],
    services: [2, 3],
    omni_channels: 269,
    post_topic: "Tấn công Hán Trung",
    objectives: "Diệt Nguỵ phục Hán",
    description: "",
    ai_create_post_info_notes: "",

    main_seo_keyword: "Tấn công",
    secondary_seo_keywords: [],
    customer_journey: undefined,
    content_tone: [],
    ai_rule_based: [],
    ai_create_post_list_notes: "",

    ai_content_suggestion: [],
    ai_create_post_detail_notes: "",
  };
};
