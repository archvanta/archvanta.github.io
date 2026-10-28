import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:4191",
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview:mock",
    url: "http://127.0.0.1:4191",
    reuseExistingServer: !process.env.CI,
  },
  reporter: "list",
});
