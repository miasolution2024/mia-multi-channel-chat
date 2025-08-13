import { redirectToErrorPage, redirectToFrontend } from "../helper";
import {
  AddOrUpdateZaloOAOmnichannel,
  GetintegrationSettingsData,
  GetOmnichannelsService,
  LogInformationEvent,
  LogIntegrationEvent,
} from "../services/directus.service";
import {
  ConfigureWebhook,
  GetAuthenticatedUserPages,
  GetFBLongLiveToken,
  SubscribePagesWebhook,
  GetFBShortLiveToken,
} from "../services/facebook-graph.service";
import {
  GetIGAuthenticatedUser,
  GetIGLongLiveToken,
  GetIGShortLiveToken,
  SubscribeIGAccountWebhook,
} from "../services/instagram.service";
import { GetAuthenticatedZaloOAPage, GetZaloAccessToken } from "../services/zalo.service";

export async function handleFacebookCallback(
  req: any,
  res: any,
  services: any,
  getSchema: any
) {
  const code = req.query.code;
  const integrationSettingsData = await GetintegrationSettingsData(
    services,
    req,
    getSchema
  );

  if (!code) {
    const logId = await LogIntegrationEvent(services, req, getSchema, {
      level: "error",
      message: `No authorization code received from Facebook.`,
      context: "handleFacebookCallback",
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
    "handleFacebookCallback"
  );

  const redirectUri = `${integrationSettingsData.public_directus_url}/directus-extension-social-connector/api/facebook/auth/callback`;

  try {
    const shortLivedUserAccessToken = await GetFBShortLiveToken(
      integrationSettingsData,
      redirectUri,
      code
    );

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Short-lived User Access Token successfully`,
      shortLivedUserAccessToken,
      "handleFacebookCallback"
    );

    const userAccessToken = await GetFBLongLiveToken(
      integrationSettingsData,
      shortLivedUserAccessToken
    );

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Long-lived User Access Token successfully`,
      userAccessToken,
      "handleFacebookCallback"
    );

    const response = await ConfigureWebhook(integrationSettingsData);

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Configure webhook successfully`,
      JSON.stringify(response),
      "handleFacebookCallback"
    );

    const pages = await GetAuthenticatedUserPages(userAccessToken);

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Get authenticated user pages successfully`,
      JSON.stringify(pages),
      "handleFacebookCallback"
    );

    await SubscribePagesWebhook(req, services, getSchema, pages);

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

export async function handleInstagramCallback(
  req: any,
  res: any,
  services: any,
  getSchema: any
) {
  const code = req.query.code;
  const integrationSettingsData = await GetintegrationSettingsData(
    services,
    req,
    getSchema
  );

  if (!code) {
    const logId = await LogIntegrationEvent(services, req, getSchema, {
      level: "error",
      message: `No authorization code received from Instagram.`,
      context: "handleInstagramCallback",
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
    "handleInstagramCallback"
  );

  const redirectUri = `${integrationSettingsData.public_directus_url}/directus-extension-social-connector/api/instagram/auth/callback`;
  try {
    const shortLivedUserAccessToken = await GetIGShortLiveToken(
      integrationSettingsData,
      redirectUri,
      code
    );

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Short-lived User Access Token successfully`,
      shortLivedUserAccessToken,
      "handleInstagramCallback"
    );

    const { accessToken, expiresIn } = await GetIGLongLiveToken(
      integrationSettingsData,
      shortLivedUserAccessToken
    );

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Long-lived User Access Token successfully`,
      accessToken,
      "handleInstagramCallback"
    );

    const user = await GetIGAuthenticatedUser(accessToken);

    await LogInformationEvent(
      req,
      services,
      getSchema,
      `Get authenticated user successfully`,
      JSON.stringify(user),
      "handleInstagramCallback"
    );

    await SubscribeIGAccountWebhook(
      req,
      services,
      getSchema,
      user,
      accessToken,
      expiresIn
    );

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
      message: `An unexpected error occurred during Instagram connection:`,
      context: "handleInstagramCallback",
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

    await AddOrUpdateZaloOAOmnichannel(
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
