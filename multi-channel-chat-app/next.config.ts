import type { NextConfig } from "next";
const isStaticExport = "false";
const nextConfig: NextConfig = {
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "i5.walmartimages.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["mui-one-time-password-input"],
};

export default nextConfig;
