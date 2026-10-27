import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto("http://127.0.0.1:4190/", { waitUntil: "networkidle" });
await page.evaluate(async () => {
  const mark = document.querySelector(".brand svg").outerHTML;
  const model = document.querySelector(".hero .model-svg").outerHTML;
  document.body.innerHTML = `<div style="width:1200px;height:630px;background:#080b10;color:#edf0f4;padding:55px 60px;position:relative;overflow:hidden;font-family:'Space Grotesk Variable',sans-serif"><div style="display:flex;align-items:center;gap:15px;position:relative;z-index:2">${mark}<span style="font-size:24px;letter-spacing:2px">ARCHVANTA</span></div><div style="position:absolute;left:470px;top:-45px;width:760px;height:620px;opacity:.8">${model}</div><div style="position:relative;z-index:2;margin-top:80px;font-size:68px;letter-spacing:-4px;line-height:1.08">Designing space.<br/><span style="color:#99a5b5">Engineering<br/>the future.</span></div><div style="position:absolute;bottom:45px;left:60px;right:60px;border-top:1px solid #303b49;padding-top:20px;font-size:10px;letter-spacing:2px;color:#99a5b5">ARCHITECTURE / BIM / INFRASTRUCTURE / DIGITAL SYSTEMS<span style="float:right;color:#8aa5ff">ARCHVANTA.GITHUB.IO</span></div></div>`;
  const brand = document.querySelector("body svg");
  brand.style.width = "40px";
  brand.style.height = "40px";
  await document.fonts.ready;
});
await page.screenshot({ path: "public/social-preview.png" });
await browser.close();
