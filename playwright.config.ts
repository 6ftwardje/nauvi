import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4411";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL },
  webServer: {
    command: "npm run dev -- --port 4411",
    url: baseURL,
    env: { SYNAPS_APP_URL: "https://synaps.example.test/app" },
  },
});
