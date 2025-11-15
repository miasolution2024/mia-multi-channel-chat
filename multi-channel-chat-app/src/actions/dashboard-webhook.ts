import { autoMiaAxiosInstance } from "@/utils/axios";

const WEBHOOK_ID = "24e38cf4-5f1a-47bf-b6b7-3ba8f2d63510";

export type DashboardWebhookPayload = {
  pages: Array<{
    id: number;
    page_id: string;
    token: string;
  }>;
  start_date: string;
  end_date: string;
  prev_start_date: string;
  prev_end_date: string;
};

export interface DashboardWebhookResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export const callDashboardWebhook = async (
  payload: DashboardWebhookPayload
): Promise<DashboardWebhookResponse> => {
  try {
    const response = await autoMiaAxiosInstance.post(
      `/webhook/${WEBHOOK_ID}`,
      // `/webhook-test/${WEBHOOK_ID}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error("Error posting to dashboard webhook:", error);

    return {
      success: false,
      message: "Có lỗi xảy ra khi gửi dữ liệu đến webhook",
    };
  }
};
