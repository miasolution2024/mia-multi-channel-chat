export const CONFIG = {
  appName: "Mia Chat App",
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
  websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "",
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? "",
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  STORAGE_KEY: "jwt_access_token",
  auth: {
    skip: true,
    redirectPath: "/dashboard/content-assistant",
  },
};
