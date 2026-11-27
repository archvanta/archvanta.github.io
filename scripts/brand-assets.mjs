// Regenerates the ARCHVANTA brand files from the mark in src/site/Logo.tsx:
// favicon.png, apple-touch-icon.png, archvanta-icon.svg, brand-mark*.svg,
// brand-wordmark*.svg and social-preview.png (1200x630).
//
// Usage (after npm ci): node scripts/brand-assets.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const INK = '#f1eee7';
const PAPER = '#0f0f0e';
const ACCENT = '#ff6a3d';

const mark = (stroke, dot = ACCENT, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">${
  bg ? `<rect width="48" height="48" rx="9" fill="${bg}"/>` : ''
}<g fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="square" stroke-linejoin="miter"><rect x="2.2" y="2.2" width="43.6" height="43.6"/><path d="M8 39 L18 11 L28 39 L38 11"/><path d="M12.3 29 H23.7"/></g><circle cx="38" cy="11" r="2.2" fill="${dot}"/></svg>`;

// App icon: the mark without its outer frame, centred on a graphite tile.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="14" fill="${PAPER}"/><g transform="translate(8 8)" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="square" stroke-linejoin="miter"><path d="M6 39 L17 9 L28 39 L39 9"/><path d="M10.7 27.5 H23.3"/></g><circle cx="47" cy="17" r="3.2" fill="${ACCENT}"/></svg>`;

const glyphs = [
  'M0 14 L6 0 L12 14 M2.6 9 H9.4',
  'M0 14 V0 H8 A3.6 3.6 0 0 1 8 7.2 H0 M7 7.2 L12 14',
  'M12 2 A7 7 0 1 0 12 12',
  'M0 0 V14 M12 0 V14 M0 7 H12',
  'M0 0 L6 14 L12 0',
  'M0 14 L6 0 L12 14 M2.6 9 H9.4',
  'M0 14 V0 L12 14 V0',
  'M0 0 H12 M6 0 V14',
  'M0 14 L6 0 L12 14 M2.6 9 H9.4',
];
const wordmark = (stroke) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 178 16" width="356" height="32" fill="none" stroke="${stroke}" stroke-width="1.9" stroke-linecap="square">${glyphs
  .map((d, i) => `<path d="${d}" transform="translate(${i * 20} 0)"/>`)
  .join('')}</svg>`;

writeFileSync('public/archvanta-icon.svg', icon);
writeFileSync('public/brand-mark.svg', mark('#141412', '#e4572e'));
writeFileSync('public/brand-mark-dark.svg', mark(INK));
writeFileSync('public/brand-wordmark.svg', wordmark('#141412'));
writeFileSync('public/brand-wordmark-dark.svg', wordmark(INK));

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium' });
async function png(svg, size, path) {
  const p = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await p.setContent(`<style>html,body{margin:0;background:transparent}svg{width:${size}px;height:${size}px;display:block}</style>${svg}`);
  await p.screenshot({ path, omitBackground: true });
  await p.close();
}
await png(icon, 64, 'public/favicon.png');
await png(icon.replace('rx="14"', 'rx="0"'), 180, 'public/apple-touch-icon.png');

const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
// Serve a standalone card from local files so no site CSS can interfere.
const files = {
  '/geist.woff2': 'node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2',
  '/mono.woff2': 'node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2',
  '/serif.woff2': 'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
  '/hero.webp': 'public/work-media/images/v43.webp',
};
const card = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(/geist.woff2)}@font-face{font-family:M;src:url(/mono.woff2)}@font-face{font-family:S;font-style:italic;src:url(/serif.woff2)}
html,body{margin:0}
</style>
<div style="width:1200px;height:630px;box-sizing:border-box;background:#0f0f0e;color:#f1eee7;position:relative;overflow:hidden;font-family:G,system-ui,sans-serif">
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(241,238,231,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(241,238,231,.06) 1px,transparent 1px);background-size:40px 40px"></div>
  <div style="position:absolute;right:0;top:0;width:600px;height:630px;overflow:hidden"><img src="/hero.webp" style="width:100%;height:100%;object-fit:cover;object-position:60% 70%;transform:scale(1.22);transform-origin:60% 80%"/></div>
  <div style="position:absolute;right:0;top:0;width:600px;height:630px;background:linear-gradient(90deg,#0f0f0e 0%,rgba(15,15,14,.55) 30%,rgba(15,15,14,0) 70%)"></div>
  <div style="position:absolute;left:64px;top:56px;display:flex;align-items:center;gap:18px">${mark(INK).replace('width="48" height="48"', 'width="44" height="44"')}${wordmark(INK).replace('width="356" height="32"', 'width="214" height="19"')}</div>
  <div style="position:absolute;left:64px;top:196px;font-size:80px;line-height:1.02;letter-spacing:-3.5px;font-weight:500">Architecture,<br/><span style="font-family:S,serif;font-style:italic;font-weight:400;letter-spacing:-1px;color:#ff6a3d">drawn</span> with intent.</div>
  <div style="position:absolute;left:64px;width:520px;bottom:48px;border-top:1px solid rgba(241,238,231,.22);padding-top:18px;font-family:M,monospace;font-size:13px;line-height:1.9;letter-spacing:1.6px;color:rgba(241,238,231,.75)"><div>MOHAMMADAMIN SADEGHI · ARCHITECTURAL DESIGNER</div><div style="color:#ff6a3d">ARCHVANTA.GITHUB.IO</div></div>
</div>`;
await page.route('http://card.local/**', (route) => {
  const path = new URL(route.request().url()).pathname;
  if (files[path]) return route.fulfill({ body: readFileSync(files[path]) });
  return route.fulfill({ body: card, contentType: 'text/html' });
});
await page.goto('http://card.local/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/social-preview.png' });
await browser.close();
console.log('brand assets written to public/');
