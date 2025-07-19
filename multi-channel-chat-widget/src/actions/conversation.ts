/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axios";

export const getConversationById = (conversationId: string): Promise<any> => {
  const url = `items/mc_conversations/${conversationId}?fields=*,participants.*,messages.*`;
  return axiosInstance.get(url);
};
