// Dev utility: full-page screenshots at desktop and mobile widths.
// Usage: node scripts/screenshot.mjs [outdir]
import { chromium } from "@playwright/test";

const out = process.argv[2] ?? "screenshots";
const base = "http://localhost:3000";

const browser = await chromium.launch();
for (const [name, viewport] of [
  ["desktop", { width: 1280, height: 800 }],
  ["mobile", { width: 360, height: 780 }],
]) {
  const page = await browser.newPage({ viewport });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  // scroll through the page so once-per-view reveals have fired
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  // horizontal overflow check
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log(`${name}: overflow=${overflow}px`);
  await page.close();
}
await browser.close();
