/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONFIG } from "../config-global";
import type { Conversation, MessageCreateRequest } from "../model";
import axiosInstance from "./axios";

export const getConversationById = async (
  conversationId: string
): Promise<Conversation> => {
  const url = `${CONFIG.serverUrl}/items/mc_conversations/${conversationId}?fields=*,participants.*,messages.*`;
  const response = await axiosInstance.get(url);
  if (response.status !== 200) {
    throw new Error("Failed to fetch conversation");
  }
  return response.data.data as Conversation;
};

// ----------------------------------------------------------------------

export async function sendMessage(request: MessageCreateRequest) {
  try {
    await axiosInstance.post(CONFIG.sendMessageWebhookUrl, request);
  } catch (error) {
    console.error("Error during create message:", error);
    throw error;
  }
}