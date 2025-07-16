import { MessageCreateRequest } from "@/models/message/message";
import axiosInstance, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------
export async function sendMessage(request: MessageCreateRequest) {
  try {
    await axiosInstance.post(endpoints.messages.create, request);
  } catch (error) {
    console.error("Error during create message:", error);
    throw error;
  }
}
