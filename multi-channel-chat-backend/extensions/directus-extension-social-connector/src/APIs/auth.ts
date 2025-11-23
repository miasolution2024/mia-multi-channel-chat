import { generatePKCE } from "../helper";
import {
  GetintegrationSettingsData,
  LogIntegrationEvent,
} from "../services/directus.service";

export async function handleFacebookAuthRequest(
  req: any,
  res: any,
  services: any,
  getSchema: any
) {
  const integrationSettingsData = await GetintegrationSettingsData(
    services,
    getSchema
  );

  try {
    const redirectUri = `${integrationSettingsData.public_directus_url}/directus-extension-social-connector/api/facebook/auth/callback`;
    const facebookAuthUrl =
      `https://www.facebook.com/v23.0/dialog/oauth?` +
      `client_id=${integrationSettingsData.facebook_app_id}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${integrationSettingsData.scopes.join(",")}&` +
      `response_type=code`;

    res.redirect(facebookAuthUrl);
  } catch (directusError: any) {
    await LogIntegrationEvent(services, getSchema, {
      level: "error",
      message: `Failed to load handle auth request: ${directusError.message}`,
      context: "handleAuthRequest",
      stack_trace: JSON.stringify(directusError),
      user_id: req.accountability ? req.accountability.user : null,
      request_string: "",
      response_string: "",
      timestamp: new Date(),
    });

    res.redirect(integrationSettingsData.public_frontend_url);
  }
}

export async function handleInstagramAuthRequest(
  req: any,
  res: any,
  services: any,
  getSchema: any
) {
  const integrationSettingsData = await GetintegrationSettingsData(
    services,
    getSchema
  );
  try {
    const redirectUri = `${integrationSettingsData.public_directus_url}/directus-extension-social-connector/api/instagram/auth/callback`;
    const instagramAuthUrl =
      `https://www.instagram.com/oauth/authorize?` +
      `client_id=${integrationSettingsData.instagram_app_id}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${integrationSettingsData.instagram_scopes.join(",")}&` +
      `response_type=code`;

    res.redirect(instagramAuthUrl);
  } catch (directusError: any) {
    await LogIntegrationEvent(services, getSchema, {
      level: "error",
      message: `Failed to load handle auth request: ${directusError.message}`,
      context: "handleInstagramAuthRequest",
      stack_trace: JSON.stringify(directusError),
      user_id: req.accountability ? req.accountability.user : null,
      request_string: "",
      response_string: "",
      timestamp: new Date(),
    });

    res.redirect(integrationSettingsData.public_frontend_url);
  }
}

export async function handleZaloOAAuthRequest(
  req: any,
  res: any,
  services: any,
  getSchema: any
) {
  const { code_verifier, code_challenge } = generatePKCE();

  const integrationSettingsData = await GetintegrationSettingsData(
    services,
    getSchema
  );

  try {
    const redirectUri = `${integrationSettingsData.public_directus_url}/directus-extension-social-connector/api/zalo/auth/callback?code_verifier=${code_verifier}`;
    const zaloAuthUrl =
      `https://oauth.zaloapp.com/v4/oa/permission?` +
      `app_id=${integrationSettingsData.zalo_app_id}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `code_challenge=${code_challenge}`;

    res.redirect(zaloAuthUrl);
  } catch (directusError: any) {
    await LogIntegrationEvent(services, getSchema, {
      level: "error",
      message: `Failed to load handle auth request: ${directusError.message}`,
      context: "handleAuthRequest",
      stack_trace: JSON.stringify(directusError),
      user_id: req.accountability ? req.accountability.user : null,
      request_string: "",
      response_string: "",
      timestamp: new Date(),
    });

    res.redirect(integrationSettingsData.public_frontend_url);
  }
}
