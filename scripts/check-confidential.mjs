#!/usr/bin/env node
// Fails when confidential data-center project material reaches the published
// site. The owner allows data-center work only as an abstract skill
// description: no project names, drawings, CAD/BIM source files or images.
//
// Usage: node scripts/check-confidential.mjs [dir ...]   (default: public src)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['public', 'src'];

// Source CAD/BIM formats are never published, whatever the project.
const blockedExt = new Set(['.dxf', '.dwg', '.rvt', '.rfa', '.ifc', '.nwd', '.nwc', '.bak']);

// Identifiers of the withdrawn data-center projects and their sites. The
// employer named in the CV/résumé is deliberately not listed here.
const blockedNames = [
  /modular-data-cent(?:re|er)/i,
  /two-level-facility/i,
  /technical-level-48-racks/i,
  /rack-room-reorganisation/i,
  /existing-hall-conversion/i,
  /data-hall-retrofit/i,
  /iran[\s_-]*insurance/i,
  /\bnoor[\s_-]*(?:data|internet|dc)\b/i,
  /بیمه[\s‌]*ایران/,
  /دیتا[\s‌]*سنتر[\s‌]*(?:نور|مخابرات|بیمه)/,
];

const textExt = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.html', '.svg', '.md', '.txt', '.xml', '.webmanifest']);
const problems = [];

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

if (problems.length) {
  console.error('Confidential material check failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`Confidential material check passed (${roots.join(', ')}).`);
