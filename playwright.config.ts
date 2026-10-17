import { defineConfig } from "@playwright/test";

/**
 * Run through `npm run test:e2e` (tests/e2e/run.mjs), which builds the site once per mode,
 * because the launch switch and the email settings are read at build time:
 *
 *   preview       default site, enquiry form enabled against a local Resend stub
 *   unconfigured  no email settings: the form must not appear
 *   launched      NEXT_PUBLIC_LAUNCHED=true: indexable, structured data, no concept copy
 */
const mode = (process.env.E2E_MODE ?? "preview") as "preview" | "unconfigured" | "launched";
const APP_PORT = 3111;
const STUB_PORT = 4010;

const emailEnv = {
  RESEND_API_KEY: "test-key",
  ENQUIRY_TO_EMAIL: "venue@example.test",
  RESEND_API_URL: `http://127.0.0.1:${STUB_PORT}/emails`,
};

const modeEnv: Record<typeof mode, Record<string, string>> = {
  preview: emailEnv,
  unconfigured: {},
  launched: { ...emailEnv, NEXT_PUBLIC_LAUNCHED: "true", NEXT_PUBLIC_SITE_URL: "https://example.test" },
};

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: `${mode}.spec.ts`,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    // Set PW_CHROMIUM_PATH to use a browser that is already installed (for example in a sandbox).
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  webServer: [
    {
      command: "node tests/e2e/stub-resend.mjs",
      url: `http://127.0.0.1:${STUB_PORT}/__received`,
      reuseExistingServer: false,
      env: { STUB_PORT: String(STUB_PORT) },
    },
    {
      command: `npm run start -- -p ${APP_PORT} -H 127.0.0.1`,
      url: `http://127.0.0.1:${APP_PORT}`,
      reuseExistingServer: false,
      timeout: 60_000,
      env: modeEnv[mode],
    },
  ],
});
