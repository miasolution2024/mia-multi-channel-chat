import { MessageCreateRequest } from "@/models/message/message";
import axiosInstance, { endpoints } from "@/utils/axios";
import axios from "axios";

// ----------------------------------------------------------------------
export async function sendMessage(request: MessageCreateRequest) {
  try {
    await axiosInstance.post(endpoints.messages.create, request);
  } catch (error) {
    console.error("Error during create message:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------
export async function sendFacebookMessage(request: MessageCreateRequest) {
  try {
    const url = 'https://auto.miasolution.vn/webhook/mia/message'
    await axios.post(url, request);
  } catch (error) {
    console.error("Error during create message:", error);
    throw error;
  }
}
