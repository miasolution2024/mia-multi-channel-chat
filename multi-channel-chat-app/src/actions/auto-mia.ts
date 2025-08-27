import { autoMiaAxiosInstance } from "@/utils/axios";

interface Step1Data {
  topic: string;
  post_type: string;
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  customer_group: {
    customer_group_id: number;
  }[];
  customer_journey: {
    customer_journey_id: number;
  }[];
  omni_channels: {
    omni_channels_id: number;
  }[];
  ai_rule_based: {
    ai_rule_based_id: number;
  }[];
  content_tone: {
    content_tone_id: number;
  }[];
  additional_notes_step_1: string;
}

interface PostBaiVietRequest {
  step1: Step1Data | Record<string, unknown>;
  step2: Record<string, unknown>;
  step3: Record<string, unknown>;
  step4: Record<string, unknown>;
}

interface PostBaiVietResponse {
  data?: {
    id: number;
    status: string;
    post_type: string | null;
    topic: string;
    main_seo_keyword: string;
    outline_post?: string;
    post_goal?: string;
    post_content?: string;
    post_html_format?: string;
    omni_channels?: {
      omni_channels_id: number;
    };
    customer_group: {
      customer_group_id: {
        id: number;
        name: string;
      };
    }[];
    content_tone: {
      content_tone_id: {
        id: number;
        tone_name: string | null;
        tone_description: string;
      };
    }[];
    customer_journey: {
      customer_journey_id: {
        id: number;
        name: string;
      };
    }[];
    ai_rule_based: {
      ai_rule_based_id: {
        id: number;
        content: string;
      };
    }[];
    media_generated_ai: {
      directus_files_id: string;
      id: number;
      url: string;
    }[];
  };
  [key: string]: unknown;
}

export const createPost = async (
  data: PostBaiVietRequest
): Promise<PostBaiVietResponse> => {
  try {
    const response = await autoMiaAxiosInstance.post("/webhook/post-bai-viet", [
      data,
    ]);
    console.log("response", response);
    return response?.data?.[0] || {};
  } catch (error) {
    console.error("Error calling post-bai-viet API:", error);
    return {};
  }
};
