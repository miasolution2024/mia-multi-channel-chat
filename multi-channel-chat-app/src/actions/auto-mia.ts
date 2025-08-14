import { autoMiaAxiosInstance } from "@/utils/axios";

interface Step1Data {
  topic: string;
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  customer_group: number[];
  customer_journey: number[];
  ai_rule_based: number[];
  content_tone: number[];
  additional_notes_step_1: string;
}

interface PostBaiVietRequest {
  step1: Step1Data;
  step2: Record<string, unknown>;
  step3: Record<string, unknown>;
  step4: Record<string, unknown>;
}

interface PostBaiVietResponse {
  outline_post?: string;
  [key: string]: unknown;
}

export const createPost = async (data: PostBaiVietRequest): Promise<PostBaiVietResponse> => {
  try {
    const response = await autoMiaAxiosInstance.post("/webhook/post-bai-viet", [data]);
    return response.data;
  } catch (error) {
    console.error("Error calling post-bai-viet API:", error);
    return {
      outline_post: "đây là ví dụ dàn ý trả về",
    }
    throw error;
  }
};