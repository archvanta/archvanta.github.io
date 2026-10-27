import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:4190",
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview -- --port 4190",
    url: "http://127.0.0.1:4190",
    reuseExistingServer: !process.env.CI,
  },
  reporter: "list",
});
