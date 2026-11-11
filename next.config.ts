import type { NextConfig } from "next";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const allowedDevOrigins = [
  "yariks-mac-mini.tail1a5e76.ts.net",
  "*.tail1a5e76.ts.net",
  ...(process.env.ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean),
];

const config: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  devIndicators: false,
  allowedDevOrigins,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default config;
