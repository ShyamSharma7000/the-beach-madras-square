// Measures real text contrast over the hero and the see-through header.
//
//   npm run build && npm run test:contrast
//
// axe cannot judge text laid over a drawn scene or a photograph, so this does it by pixels. For each
// line of hero and header text it hides all text, screenshots the page, samples the pixels behind
// that line, composites the text colour over each one, and takes the 2nd-percentile WCAG ratio
// (so a few stray bright pixels do not decide it). The drawn hero has a time-of-day slider, so it
// is measured at 12 positions; a photo hero has no slider and is measured once.
//
// Needs 4.5:1 for normal text and 3:1 for large text (24px, or 18.66px bold). Exits 1 on failure.
// Set PW_CHROMIUM_PATH to use an already-installed Chromium. Set CONTRAST_PORT to change the port.
import { createRequire } from "node:module";
import { spawn, spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
const { chromium } = require("@playwright/test");

const PORT = Number(process.env.CONTRAST_PORT || 3115);
const WIDTHS = (process.env.WIDTHS || "360,390,768,1024,1440").split(",").map(Number);
const STEPS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1];

const server = spawn("npx", ["next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
  cwd: process.cwd(),
  detached: process.platform !== "win32",
  stdio: "ignore",
  shell: process.platform === "win32",
  env: process.env,
});

async function ready() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://127.0.0.1:${PORT}/`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("The site did not start. Run `npm run build` first.");
}

// Runs in the page: every visible line of hero and header text, with its colour and box.
const collect = () => {
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  cv.canvas.width = cv.canvas.height = 1;
  const rgba = (css) => {
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = "#000";
    cv.fillStyle = css;
    cv.fillRect(0, 0, 1, 1);
    const d = cv.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const out = [];
  const els = document.querySelectorAll(
    "header a:not(.btn), header span, main > section:first-of-type h1, main > section:first-of-type p",
  );
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || el.closest(".sr-only")) continue;
    if (!(el.textContent || "").trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter(
      (r) => r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < innerHeight,
    );
    if (!rects.length) continue;
    const size = parseFloat(cs.fontSize);
    out.push({
      label: `${el.tagName.toLowerCase()}: ${(el.textContent || "").trim().slice(0, 38)}`,
      color: rgba(cs.color),
      large: size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700),
      size,
      rects: rects.map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })),
    });
  }
  return out;
};

// Runs in a blank page: decode the screenshot and score each line.
const score = async ({ b64, items }) => {
  const img = new Image();
  img.src = "data:image/png;base64," + b64;
  await img.decode();
  const c = document.getElementById("c");
  c.width = img.width;
  c.height = img.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const lin = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const L = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b);
  return items.map((it) => {
    const ratios = [];
    for (const r of it.rects) {
      const x = Math.max(0, Math.floor(r.x));
      const y = Math.max(0, Math.floor(r.y));
      const w = Math.min(img.width - x, Math.ceil(r.w));
      const h = Math.min(img.height - y, Math.ceil(r.h));
      if (w <= 0 || h <= 0) continue;
      const d = g.getImageData(x, y, w, h).data;
      for (let i = 0; i < d.length; i += 12) {
        const a = it.color[3];
        const l1 = L(
          a * it.color[0] + (1 - a) * d[i],
          a * it.color[1] + (1 - a) * d[i + 1],
          a * it.color[2] + (1 - a) * d[i + 2],
        );
        const l2 = L(d[i], d[i + 1], d[i + 2]);
        ratios.push((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
      }
    }
    ratios.sort((p, q) => p - q);
    return { label: it.label, large: it.large, size: it.size, worst: ratios[Math.floor(ratios.length * 0.02)] ?? null };
  });
};

let failures = 0;
try {
  await ready();
  const browser = await chromium.launch(
    process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  );
  const analyser = await (await browser.newContext()).newPage();
  await analyser.setContent("<canvas id=c></canvas>");
  const results = [];

  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 800 : 900 } });
    await ctx.addInitScript(() => sessionStorage.setItem("tb-intro", "1"));
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const slider = page.locator("input[type=range]");
    const steps = (await slider.count()) ? STEPS : [null];
    for (const t of steps) {
      await page.evaluate(() => window.scrollTo(0, 0));
      if (t !== null) await slider.fill(String(t));
      await page.waitForTimeout(250);
      const items = await page.evaluate(collect);
      const hide = await page.addStyleTag({
        content:
          "header *, main > section:first-of-type h1, main > section:first-of-type p { color: transparent !important; text-shadow: none !important; }",
      });
      const buf = await page.screenshot({ type: "png" });
      await hide.evaluate((n) => n.remove());
      const verdicts = await analyser.evaluate(score, { b64: buf.toString("base64"), items });
      for (const v of verdicts) results.push({ w, t, ...v });
    }
    await ctx.close();
  }
  await browser.close();

  // Worst case per width and line, across the whole day.
  const worst = new Map();
  for (const r of results) {
    if (r.worst == null) continue;
    const k = `${r.w}|${r.label}`;
    if (!worst.has(k) || r.worst < worst.get(k).worst) worst.set(k, r);
  }
  for (const [, r] of [...worst].sort()) {
    const need = r.large ? 3 : 4.5;
    const ok = r.worst >= need;
    if (!ok) failures++;
    console.log(
      `${ok ? "ok  " : "FAIL"} ${String(r.w).padStart(4)}px  worst ${r.worst.toFixed(2)} (needs ${need})` +
        (r.t === null ? "" : ` at t=${r.t}`) +
        `  ${r.size}px  ${r.label}`,
    );
  }
  console.log(`\n${failures} text line(s) below WCAG AA, ${worst.size} checked across ${WIDTHS.length} widths`);
} finally {
  // Stop the server and everything it started. Windows has no process groups, so ask taskkill.
  try {
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"]);
    else process.kill(-server.pid);
  } catch {}
}
process.exit(failures ? 1 : 0);
