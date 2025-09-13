import { autoMiaAxiosInstance } from "@/utils/axios";

export type PostRequest = {
  id: number;
  startStep: number;
  endStep: number;
}[]

interface PostResponse {
  success: boolean;
  message?: string;
  data?: {
    totalStepRun: number;
    step: number;
    post_id: number;
  }[];
}

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
