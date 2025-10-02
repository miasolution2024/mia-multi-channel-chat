import { autoMiaAxiosInstance } from "@/utils/axios";

export type PostRequest = {
  id: number;
  startStep: number;
  endStep: number;
}[]

export type CampaignRequest = PostRequest

interface PostResponse {
  success: boolean;
  message?: string;
  data?: {
    totalStepRun: number;
    step: number;
    post_id: number;
  }[];
}

export type CampaignResponse = PostResponse



export const createPost = async (
  data: PostRequest
): Promise<PostResponse> => {
  try {
    const response = await autoMiaAxiosInstance.post("/webhook/post-bai-viet", 
     { data}
    );
    return {
      success: true,
      data: response.data || []
    };
  } catch (error: unknown) {
    console.error("Error calling post-bai-viet API:", error);
    return {
      success: false,
      message: 'Có lỗi xảy ra'
    };
  }
};

export const createCampaignN8N = async (
  data: CampaignRequest
): Promise<CampaignResponse> => {
  try {
    const response = await autoMiaAxiosInstance.post("/webhook/campaign", 
     { data}
    );
    return {
      success: true,
      data: response.data || []
    };
  } catch (error: unknown) {
    console.error("Error calling campaign API:", error);
    return {
      success: false,
      message: 'Có lỗi xảy ra'
    };
  }
};
