import { CONFIG } from "../config-global";
import type { UserInfo } from "../model";
import axiosInstance from "./axios";

export const startChatSessionAsync = async (request: {
  name: string;
  phone: string;
}): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.post(CONFIG.startChatSessionWebhookUrl, {...request, email: ""});

    if (response.status !== 200) {
      throw new Error("Failed to start chat session");
    }

    const { access_token } = response.data;

    if (!access_token) {
      delete axiosInstance.defaults.headers.common.Authorization;
      throw new Error("Access token not found in response");
    }

    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;

    return response.data;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};
