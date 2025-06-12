import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 180_000, // each test gets 3 min max
  expect: { timeout: 5_000 },
  workers: 1, // 🌟 run specs serially – no triple compile
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    timeout: 300_000, // wait up to 5 min for first CRA build
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: devices["Desktop Chrome"] },
    { name: "firefox", use: devices["Desktop Firefox"] },
    { name: "webkit", use: devices["Desktop Safari"] },
  ],
});
