export const CONFIG = {
  appName: "NTQ Grocery",
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? "",
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  STORAGE_KEY: "jwt_access_token",
  SIGN_IN_REDIRECT_URL: "signInRedirectUrl",
  SIGN_IN_REDIRECT_DATA: "signInRedirectData",
  auth: {
    skip: false,
    redirectPath: "/dashboard",
  },
};
