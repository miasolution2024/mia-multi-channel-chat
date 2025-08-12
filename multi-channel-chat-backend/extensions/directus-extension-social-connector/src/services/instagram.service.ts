import { IGAxiosInstance } from "../axios";
import {
  AddOrUpdateIGOmnichannel,
  AppSettings,
  GetOmnichannelsService,
  LogInformationEvent,
} from "./directus.service";

export async function GetIGShortLiveToken(
  integrationSettingsData: AppSettings,
  redirectUri: string,
  code: string
): Promise<string> {
  try {
    const tokenExchangeUrl = `https://api.instagram.com/oauth/access_token`;
    const formData = new FormData();
    formData.append("client_id", integrationSettingsData.instagram_app_id);
    formData.append(
      "client_secret",
      integrationSettingsData.instagram_app_secret
    );
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", redirectUri);
    formData.append("code", code);
    const tokenResponse = await IGAxiosInstance.post(
      tokenExchangeUrl,
      formData
    );

    if (tokenResponse.data.error) {
      throw new Error(
        `Error getting short lived token: ${tokenResponse.data.error.message}`
      );
    }
    return tokenResponse.data.access_token;
  } catch (error: any) {
    throw error;
  }
}

export async function GetIGLongLiveToken(
  integrationSettingsData: AppSettings,
  shortLivedUserAccessToken: string
): Promise<any> {
  try {
    const longLivedTokenExchangeUrl =
      `https://graph.instagram.com/access_token?` +
      `grant_type=ig_exchange_token&` +
      `client_secret=${integrationSettingsData.instagram_app_secret}&` +
      `access_token=${shortLivedUserAccessToken}`;

    const longLivedTokenResponse = await IGAxiosInstance.get(
      longLivedTokenExchangeUrl
    );
    if (longLivedTokenResponse.data.error) {
      throw new Error(
        `Error get long live token token: ${longLivedTokenResponse.data.error}`
      );
    }
    return {
      accessToken:
        longLivedTokenResponse.data.access_token || shortLivedUserAccessToken,
      expiresIn: longLivedTokenResponse.data.expires_in,
    };
  } catch (error: any) {
    throw error;
  }
}

export async function SubscribeIGWebhook(
  userId: string,
  userAccessToken: string
): Promise<void> {
  const subscribeUrl = `https://graph.instagram.com/v23.0/${userId}/subscribed_apps`;
  const fieldsToSubscribe = "messages";
  try {
    const response = await IGAxiosInstance.post(subscribeUrl, {
      access_token: userAccessToken,
      subscribed_fields: fieldsToSubscribe,
    });

    if (!response.data.success) {
      throw new Error(`Failed to subscribe webhook: ${response.data.error}`);
    }
  } catch (error: any) {
    throw error;
  }
}

export async function GetIGAuthenticatedUser(
  userAccessToken: string
): Promise<any[]> {
  try {
    const url = `https://graph.instagram.com/v23.0/me?access_token=${userAccessToken}&fields=biography,name,profile_picture_url,username`;
    const userResponse = await IGAxiosInstance.get(url);
    return userResponse.data;
  } catch (error: any) {
    throw error;
  }
}

export async function SubscribeIGAccountWebhook(
  req: any,
  services: any,
  getSchema: any,
  user: any,
  userAccessToken: string,
  expiresIn: number
) {
  const OmnichannelsService = await GetOmnichannelsService(
    services,
    req,
    getSchema
  );

  try {
    await SubscribeIGWebhook(user.id, userAccessToken);

    await AddOrUpdateIGOmnichannel(
      OmnichannelsService,
      user,
      userAccessToken,
      expiresIn,
      true
    );

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Subscribed to webhook for user ${user.username} (${user.id}) successfully`,
      JSON.stringify(user),
      "SubscribeIGAccountWebhook"
    );
  } catch (error: any) {
    throw error;
  }
}

export async function ConfigureIGWebhook(
  integrationSettingsData: AppSettings
): Promise<any> {
  try {
    const appAccessToken = await GetIGAppAccessToken(integrationSettingsData);
    const response = await IGAxiosInstance.post(
      `https://graph.instagram.com/${integrationSettingsData.instagram_app_id}/subscriptions?access_token=${appAccessToken}`,
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

export async function GetIGAppAccessToken(
  integrationSettingsData: AppSettings
): Promise<string> {
  try {
    const appAccessTokenUrl =
      `https://graph.instagram.com/oauth/access_token?` +
      `client_id=${integrationSettingsData.instagram_app_id}&` +
      `client_secret=${integrationSettingsData.instagram_app_secret}&` +
      `grant_type=client_credentials`;

    const response = await IGAxiosInstance.get(appAccessTokenUrl);
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
