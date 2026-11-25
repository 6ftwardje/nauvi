import type { NextConfig } from "next";

const isPreview = process.env.CONTEXT === "deploy-preview" || process.env.CONTEXT === "branch-deploy";

const config: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  devIndicators: false,
  async headers() {
    return isPreview ? [{
      source: "/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }] : [];
  },
};

export default config;
