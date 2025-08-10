export interface ZaloOAPage {
  oa_id: string;
  name: string;
  description: string;
  oa_alias: string;
  is_verified: boolean;
  oa_type: ZaloOAType;
  cate_name: string;
  num_follower: number;
  avatar: string;
  cover: string;
  package_name: string;
  package_valid_through_date: Date;
  package_auto_renew_date: Date;
  linked_ZCA: string;
}

export enum ZaloOAType {
  Enterprise = 2,
  Goverment = 4,
}
import {
  AddOrUpdateOmnichannel,
  AppSettings,
  GetOmnichannelsService,
  LogInformationEvent,
} from "./directus.service";
import axiosInstance from "../axios";
import axios from "axios";

export async function GetZaloAccessToken(
  integrationSettingsData: AppSettings,
  code: string,
  codeVerifier: string
): Promise<any> {
  try {
    const requestBody = new URLSearchParams();
    requestBody.append("code", code);
    requestBody.append("app_id", integrationSettingsData.zalo_app_id);
    requestBody.append("grant_type", "authorization_code");
    requestBody.append("code_verifier", codeVerifier);
    const tokenResponse = await axiosInstance.post(
      "/access_token",
      requestBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          secret_key: integrationSettingsData.zalo_app_secret,
        },
      }
    );

    if (tokenResponse.data.error) {
      throw new Error(
        `Error getting short lived token: ${tokenResponse.data.error.message}`
      );
    }
    return {
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
    };
  } catch (error: any) {
    throw error;
  }
}

export async function SubscribeFacebookPageWebhook(
  pageId: string,
  pageAccessToken: string
): Promise<void> {
  const subscribeUrl = `/${pageId}/subscribed_apps`;
  const fieldsToSubscribe = "messages";
  try {
    const response = await axiosInstance.post(subscribeUrl, {
      access_token: pageAccessToken,
      subscribed_fields: fieldsToSubscribe,
    });

    if (!response.data.success) {
      throw new Error(
        `Failed to subscribe webhook for page ${pageId}: ${response.data.error}`
      );
    }
  } catch (error: any) {
    throw error;
  }
}

export async function GetAuthenticatedZaloOAPage(
  accessToken: string
): Promise<ZaloOAPage> {
  try {
    const pagesUrl = `https://openapi.zalo.me/v2.0/oa/getoa`;
    const pagesResponse = await axios.get(pagesUrl, {
      headers: {
        access_token: accessToken,
      },
    });
    const page: ZaloOAPage = pagesResponse.data.data;
    if (!page) {
      throw new Error("No Zalo OA Page found for the user.");
    }
    return page;
  } catch (error: any) {
    throw error;
  }
}

export async function ConfigureWebhook(
  integrationSettingsData: AppSettings
): Promise<any> {
  try {
    const appAccessToken = await GetAppAccessToken(integrationSettingsData);
    const response = await axiosInstance.post(
      `/${integrationSettingsData.facebook_app_id}/subscriptions?access_token=${appAccessToken}`,
      {
        object: "page",
        callback_url: integrationSettingsData.n8n_webhook_url,
        fields: "messages",
        verify_token: integrationSettingsData.webhook_verify_token,
      }
    );

    if (response.data.error) {
      throw new Error(
        `Error configuring webhook: ${response.data.error.message}`
      );
    }
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function GetAppAccessToken(
  integrationSettingsData: AppSettings
): Promise<string> {
  try {
    const appAccessTokenUrl =
      `/oauth/access_token?` +
      `client_id=${integrationSettingsData.facebook_app_id}&` +
      `client_secret=${integrationSettingsData.facebook_app_secret}&` +
      `grant_type=client_credentials`;

    const response = await axiosInstance.get(appAccessTokenUrl);
    if (response.data.error) {
      throw new Error(
        `Error getting app access token: ${response.data.error.message}`
      );
    }
    return response.data.access_token;
  } catch (error: any) {
    throw error;
  }
}
