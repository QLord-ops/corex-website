/**
 * Record ChatWidget screen demo at 390×844 for ad assembly.
 * Requires: frontend on :3000, backend on :8000 with OPENAI_API_KEY.
 */
import { chromium } from "playwright";
import { mkdirSync, renameSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "assets");
mkdirSync(ASSETS, { recursive: true });

const waitForInputReady = async (page, timeout = 90000) => {
  await page.waitForFunction(
    () => {
      const input = document.querySelector('form input[type="text"]');
      return input && !input.disabled;
    },
    { timeout }
  );
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    recordVideo: { dir: ASSETS, size: { width: 390, height: 844 } },
    locale: "de-DE",
  });

  const page = await context.newPage();

  await page.goto("http://localhost:3000/de", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.removeItem("aionex_chat");
    localStorage.removeItem("aionex_chat_session");
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  await page.getByRole("button", { name: "KI-Chat", exact: true }).click();
  await page.waitForTimeout(600);

  await page.getByRole("button", { name: "Was kostet ein Projekt?" }).click();
  await waitForInputReady(page);
  await page.waitForTimeout(500);

  const contact =
    "Ja, bitte Rückruf. max@firma.de, +49 170 1234567";
  await page.locator('form input[type="text"]').fill(contact);
  await page.getByRole("button", { name: "Senden" }).click();
  await waitForInputReady(page);
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: "Close chat" }).click();
  await page.waitForTimeout(1200);

  const video = page.video();
  await page.close();
  const tempPath = await video.path();
  await context.close();
  await browser.close();

  const outPath = path.join(ASSETS, "demo.webm");
  if (tempPath && existsSync(tempPath)) {
    renameSync(tempPath, outPath);
    console.log(`Saved ${outPath}`);
  } else {
    throw new Error("No video recorded");
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
