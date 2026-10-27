import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
for (const cfg of [
  { id: "desktop", width: 1440, height: 900 },
  { id: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: cfg });
  await page.goto("http://127.0.0.1:4190/", { waitUntil: "networkidle" });
  const frames = await page.evaluate(async () => {
    const frames = [];
    let last = performance.now();
    const until = last + 3000;
    await new Promise((resolve) => {
      function frame(now) {
        frames.push(now - last);
        last = now;
        if (now < until) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
    return frames.slice(2);
  });
  frames.sort((a, b) => a - b);
  console.log(
    JSON.stringify({
      id: cfg.id,
      frames: frames.length,
      mean: frames.reduce((a, b) => a + b, 0) / frames.length,
      p95: frames[Math.floor(frames.length * 0.95)],
      over20ms: frames.filter((x) => x > 20).length,
    }),
  );
  await page.close();
}
await browser.close();
