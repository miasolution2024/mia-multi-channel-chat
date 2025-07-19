/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserInfo } from "../model";
import axiosInstance from "./axios";

export const startNewChatAsync = async (request: UserInfo): Promise<any> => {
  try {
    const response = await axiosInstance.post("", request);

    const { access_token: token } = response.data.data;

    if (!token) {
      delete axiosInstance.defaults.headers.common.Authorization;
      throw new Error("Access token not found in response");
    }
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};
