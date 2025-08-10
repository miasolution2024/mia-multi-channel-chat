import { generatePKCE, redirectToErrorPage } from "../helper";
import {
  GetintegrationSettingsData,
  LogIntegrationEvent,
} from "../services/directus.service";

export async function handleAuthRequest(
  req: any,
  res: any,
  services: any,
  getSchema: any,
  env: any
) {
  console.log(env);

  const { code_verifier, code_challenge } = generatePKCE();

  const integrationSettingsData = await GetintegrationSettingsData(
    services,
    req,
    getSchema
  );

  try {
    const redirectUri = `${integrationSettingsData.public_directus_url}/directus-extension-zalo-connector/api/zalo/auth/callback?code_verifier=${code_verifier}`;
    const zaloAuthUrl =
      `https://oauth.zaloapp.com/v4/oa/permission?` +
      `app_id=${integrationSettingsData.zalo_app_id}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `code_challenge=${code_challenge}`;

    res.redirect(zaloAuthUrl);
  } catch (directusError: any) {
    const logId = await LogIntegrationEvent(services, req, getSchema, {
      level: "error",
      message: `Failed to load handle auth request: ${directusError.message}`,
      context: "handleAuthRequest",
      stack_trace: JSON.stringify(directusError),
      user_id: req.accountability ? req.accountability.user : null,
      request_string: "",
      response_string: "",
      timestamp: new Date(),
    });

    redirectToErrorPage(
      res,
      integrationSettingsData.public_directus_url,
      logId
    );
  }
}
