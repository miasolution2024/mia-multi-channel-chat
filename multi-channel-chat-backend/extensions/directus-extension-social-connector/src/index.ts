import { defineEndpoint } from "@directus/extensions-sdk";
import { handleFacebookCallback, handleInstagramCallback } from "./APIs/callback";
import {
  handleFacebookAuthRequest,
  handleInstagramAuthRequest,
} from "./APIs/auth";

export default defineEndpoint((router, { services, getSchema, env }) => {
  router.get("/api/facebook/auth", (req, res) =>
    handleFacebookAuthRequest(req, res, services, getSchema, env)
  );

  router.get("/api/facebook/auth/callback", (req, res) =>
    handleFacebookCallback(req, res, services, getSchema)
  );

  router.get("/api/instagram/auth", (req, res) =>
    handleInstagramAuthRequest(req, res, services, getSchema, env)
  );

  router.get("/api/instagram/auth/callback", (req, res) =>
    handleInstagramCallback(req, res, services, getSchema)
  );

});
