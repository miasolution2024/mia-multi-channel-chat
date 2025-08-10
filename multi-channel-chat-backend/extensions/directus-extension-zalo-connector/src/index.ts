import { defineEndpoint } from "@directus/extensions-sdk";
import { handleAuthRequest } from "./APIs/auth";
import { handleZaloOACallback } from "./APIs/callback";

export default defineEndpoint((router, { services, getSchema, env }) => {
  router.get("/api/zalo/auth", (req, res) =>
    handleAuthRequest(req, res, services, getSchema, env)
  );

  router.get("/api/zalo/auth/callback", (req, res) =>
    handleZaloOACallback(req, res, services, getSchema)
  );
});
