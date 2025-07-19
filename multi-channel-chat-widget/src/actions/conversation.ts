/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONFIG } from "../config-global";
import type { Conversation, Message, MessageCreateRequest } from "../model";
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

export async function sendCustomerMessage(request: MessageCreateRequest) {
  try {
    await axiosInstance.post(CONFIG.sendMessageWebhookUrl, request);
  } catch (error) {
    console.error("Error during create message:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function sendWelcomeMessage(request: MessageCreateRequest) {
  try {
    const response = await axiosInstance.post(
      `${CONFIG.serverUrl}/items/mc_messages`,
      request
    );
    if (response.status !== 200) {
      throw new Error("Failed to send welcome message");
    }
    return response.data.data as Message;
  } catch (error) {
    console.error("Error during server message:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateConversationLastMessageDataAsync(
  conversationId: string,
  message: string
) {
  try {
    const url = `${CONFIG.serverUrl}/items/mc_conversations/${conversationId}`;
    const response = await axiosInstance.patch(url, {
      last_message_at: new Date(),
      last_message_summary: message,
    });
    if (response.status !== 200) {
      throw new Error("Failed to send welcome message");
    }
  } catch (error) {
    console.error("Error during update conversation:", error);
    throw error;
  }
}