#!/usr/bin/env node
// Guards the published site against confidential data-center material.
//
// The owner chose (2026-11-28) to show the data-center projects as redacted
// text, plus drawings only once he has approved a cleared export. So:
//  1. CAD/BIM source files are never published, whatever the project.
//  2. Client, operator and site names never appear anywhere in public/ or src/.
//  3. Data-center projects carry no client/team wording or exact plate sizes.
//  4. A data-center project may reference an image only when that exact file
//     is listed in scripts/dc-approved-media.json (owner-approved, redacted).
//
// Usage: node scripts/check-confidential.mjs [dir ...]   (default: public src)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['public', 'src'];
const problems = [];

// 1. Source CAD/BIM formats.
const blockedExt = new Set(['.dxf', '.dwg', '.rvt', '.rfa', '.ifc', '.nwd', '.nwc', '.bak']);

// 2. Client, operator and site names. The employer named in the CV/résumé is
// deliberately not listed here.
const blockedNames = [
  /iran[\s_-]*insurance/i,
  /\bnoor[\s_-]*(?:data|internet|dc)\b/i,
  /بیمه[\s‌]*ایران/,
  /دیتا[\s‌]*سنتر[\s‌]*(?:نور|مخابرات|بیمه)/,
];

const textExt = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.html', '.svg', '.md', '.txt', '.xml', '.webmanifest']);

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      walk(full);
      continue;
    }
    const rel = relative(process.cwd(), full);
    const ext = extname(name).toLowerCase();
    if (blockedExt.has(ext)) problems.push(`${rel}: CAD/BIM source file must not be published`);
    for (const re of blockedNames) if (re.test(name)) problems.push(`${rel}: file name matches ${re}`);
    if (textExt.has(ext) && st.size < 5_000_000 && !rel.endsWith('check-confidential.mjs')) {
      const text = readFileSync(full, 'utf8');
      for (const re of blockedNames) {
        const m = text.match(re);
        if (m) problems.push(`${rel}: contains "${m[0]}"`);
      }
    }
  }
}

for (const r of roots) {
  try {
    walk(r);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

// 3 + 4. Data-center projects in the portfolio.
const DC = 'Data Center Design';
const sourcePath = 'src/content/portfolio-source.json';
const approvedPath = 'scripts/dc-approved-media.json';
if (existsSync(sourcePath)) {
  const approved = new Set(existsSync(approvedPath) ? JSON.parse(readFileSync(approvedPath, 'utf8')).files ?? [] : []);
  const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const fa = {
    ...JSON.parse(readFileSync('src/content/portfolio-fa.json', 'utf8')),
    ...JSON.parse(readFileSync('src/content/portfolio-fa-extra.json', 'utf8')),
  };
  const dcWording = [
    /\btele(?:com|communications?)\b/i,
    /\bclients?\b/i,
    /\boperator\b/i,
    /\b(?:three|four|five)-person\b/i,
    /\d+[.,]\d+\s*[×x]\s*\d+[.,]\d+\s*m/i, // exact plate/hall sizes
    /\b\d{2,3}[.,]\d{2}\s*m\b/, // exact long dimensions such as 27.33 m
    /m²/,
    /\b(?:north|south|east|west)(?:ern)?\b/i,
    /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
    /مخابرات|کارفرما/,
  ];
  const strings = (o, out = []) => {
    if (typeof o === 'string') out.push(o);
    else if (Array.isArray(o)) o.forEach((x) => strings(x, out));
    else if (o && typeof o === 'object') Object.values(o).forEach((x) => strings(x, out));
    return out;
  };
  const images = (p) => [p.cover, ...(p.gallery ?? []), ...(p.boards?.items ?? [])].filter(Boolean).map((i) => i.src)
    .concat((p.groups ?? []).flatMap((g) => g[1] ?? []));
  for (const p of source.projects ?? []) {
    if (p.category !== DC) continue;
    for (const s of strings(p)) {
      for (const text of [s, fa[s]].filter(Boolean)) {
        for (const re of dcWording) {
          const m = text.match(re);
          if (m) problems.push(`${sourcePath} [${p.slug}]: redact "${m[0]}"`);
        }
      }
    }
    for (const src of images(p)) {
      if (!approved.has(src)) problems.push(`${sourcePath} [${p.slug}]: image ${src} is not in ${approvedPath}`);
    }
    if (p.proposal) problems.push(`${sourcePath} [${p.slug}]: proposal pages need owner-approved files first`);
  }
}

if (problems.length) {
  console.error('Confidential material check failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`Confidential material check passed (${roots.join(', ')}).`);
