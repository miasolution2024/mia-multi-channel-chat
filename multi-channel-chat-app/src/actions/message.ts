import { MessageCreateRequest } from "@/models/message/message";
import axios from "axios";

// ----------------------------------------------------------------------
// export async function sendMessage(request: MessageCreateRequest) {
//   try {
//     await axiosInstance.post(endpoints.messages.create, request);
//   } catch (error) {
//     console.error("Error during create message:", error);
//     throw error;
//   }
// }

// ----------------------------------------------------------------------
export async function sendMessage(request: MessageCreateRequest) {
  try {
    const url = 'https://auto.miasolution.vn/webhook/donghan-ai-chat'
    await axios.post(url, request);
  } catch (error) {
    console.error("Error during create message:", error);
    throw error;
  }
}
