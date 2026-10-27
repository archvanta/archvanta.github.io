import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
for (const cfg of [
  { id: "desktop-en", width: 1440, height: 1000, lang: "en", theme: "dark" },
  { id: "mobile-en", width: 390, height: 844, lang: "en", theme: "dark" },
  { id: "desktop-fa", width: 1440, height: 1000, lang: "fa", theme: "dark" },
  {
    id: "mobile-fa-light",
    width: 390,
    height: 844,
    lang: "fa",
    theme: "light",
  },
]) {
  const page = await browser.newPage({
    viewport: { width: cfg.width, height: cfg.height },
    reducedMotion: "reduce",
  });
  await page.addInitScript(({ lang, theme }) => {
    localStorage.setItem("archvanta:language", lang);
    localStorage.setItem("archvanta:theme", theme);
  }, cfg);
  await page.goto("http://127.0.0.1:4190/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (
    let y = 0;
    y < (await page.evaluate(() => document.body.scrollHeight));
    y += 700
  ) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(65);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((i) => i.loading === "lazy")
        .map((i) => i.decode().catch(() => undefined)),
    ),
  );
  await page.screenshot({ path: `/tmp/av-${cfg.id}.png`, fullPage: true });
  await page.close();
}
await browser.close();
