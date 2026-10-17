// Builds the site once per mode, then runs that mode's end-to-end tests.
//   node tests/e2e/run.mjs            all three modes
//   node tests/e2e/run.mjs preview    one mode
// Works on macOS, Linux and Windows (no shell-specific env syntax).
import { spawnSync } from "node:child_process";

const BUILD_ENV = {
  preview: { RESEND_API_KEY: "test-key", ENQUIRY_TO_EMAIL: "venue@example.test" },
  unconfigured: {},
  launched: {
    RESEND_API_KEY: "test-key",
    ENQUIRY_TO_EMAIL: "venue@example.test",
    NEXT_PUBLIC_LAUNCHED: "true",
    NEXT_PUBLIC_SITE_URL: "https://example.test",
  },
};

const wanted = process.argv.slice(2);
const modes = wanted.length ? wanted : Object.keys(BUILD_ENV);
const results = {};

// Keep the parent shell's own variables from changing a mode's build.
const clean = { ...process.env };
for (const k of ["RESEND_API_KEY", "ENQUIRY_TO_EMAIL", "RESEND_API_URL", "NEXT_PUBLIC_LAUNCHED", "NEXT_PUBLIC_SITE_URL"]) delete clean[k];

for (const mode of modes) {
  if (!(mode in BUILD_ENV)) {
    console.error(`Unknown mode "${mode}". Use: ${Object.keys(BUILD_ENV).join(", ")}`);
    process.exit(2);
  }
  console.log(`\n=== ${mode}: build ===`);
  const build = spawnSync("npm", ["run", "build"], { stdio: "inherit", shell: true, env: { ...clean, ...BUILD_ENV[mode] } });
  if (build.status !== 0) {
    results[mode] = "BUILD FAILED";
    continue;
  }
  console.log(`\n=== ${mode}: tests ===`);
  const test = spawnSync("npx", ["playwright", "test"], { stdio: "inherit", shell: true, env: { ...clean, E2E_MODE: mode } });
  results[mode] = test.status === 0 ? "passed" : "FAILED";
}

console.log("\nSummary");
for (const [m, r] of Object.entries(results)) console.log(`  ${m}: ${r}`);
process.exit(Object.values(results).every((r) => r === "passed") ? 0 : 1);
