import { redirectToErrorPage, redirectToFrontend } from "../helper";
import {
  AddOrUpdateOmnichannel,
  GetintegrationSettingsData,
  GetOmnichannelsService,
  LogInformationEvent,
  LogIntegrationEvent,
} from "../services/directus.service";
import {
  ConfigureWebhook,
  GetZaloAccessToken,
  GetAuthenticatedZaloOAPage,
} from "../services/zalo.service";

export async function handleZaloOACallback(
  req: any,
  res: any,
  services: any,
  getSchema: any
) {
  const code = req.query.code;
  const code_verifier = req.query.code_verifier;
  const integrationSettingsData = await GetintegrationSettingsData(
    services,
    req,
    getSchema
  );

  if (!code || !code_verifier) {
    const logId = await LogIntegrationEvent(services, req, getSchema, {
      level: "error",
      message: `No authorization code received from Zalo.`,
      context: "handleZaloCallback",
      stack_trace: "",
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
    return;
  }

  await LogInformationEvent(
    req,
    services,
    getSchema,
    `Redirect with authenticated code successfully`,
    code,
    "handleZaloCallback"
  );

  try {
    const { accessToken, refreshToken } = await GetZaloAccessToken(
      integrationSettingsData,
      code,
      code_verifier
    );

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Get Access Token successfully`,
      accessToken,
      "handleZaloCallback"
    );

    const page = await GetAuthenticatedZaloOAPage(accessToken);

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Get zalo OA page successfully`,
      JSON.stringify(page),
      "handleZaloCallback"
    );

    const OmnichannelsService = await GetOmnichannelsService(
      services,
      req,
      getSchema
    );

    await AddOrUpdateOmnichannel(
      OmnichannelsService,
      page,
      accessToken,
      refreshToken,
      true
    );

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Add Omni Channel page successfully`,
      "",
      "handleZaloCallback"
    );

    // await SubscribePagesWebhook(req, services, getSchema, pages);

    redirectToFrontend(res, integrationSettingsData.public_directus_url);
  } catch (error: any) {
    const errorMessage =
      error instanceof Error
        ? error.stack || error.message
        : typeof error === "string"
        ? error
        : JSON.stringify(error);

    const logId = await LogIntegrationEvent(services, req, getSchema, {
      level: "error",
      message: `An unexpected error occurred during Facebook connection:`,
      context: "handleFacebookCallback",
      stack_trace: errorMessage,
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
