// Verifies that every migrated portfolio asset is present in the directory
// that will be published. `/portfolio/` is a separate GitHub Pages project,
// so these files must stay in the independent `/work-media/` namespace.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const publishRoot = resolve(process.argv[2] ?? "public");
const source = JSON.parse(readFileSync("src/content/portfolio-source.json", "utf8"));
const manifest = JSON.parse(
  readFileSync("docs/migration/portfolio-asset-manifest.json", "utf8"),
);

const failures = [];
const checked = new Set();

function checkUrl(url) {
  if (typeof url !== "string" || !url.startsWith("/work-media/")) return;
  checked.add(url);
  const file = join(publishRoot, url.slice(1));
  if (!existsSync(file)) failures.push(`${url}: missing from ${publishRoot}`);
  else if (!statSync(file).isFile() || statSync(file).size === 0)
    failures.push(`${url}: empty or not a regular file`);
}

function walk(value) {
  if (typeof value === "string") checkUrl(value);
  else if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === "object") Object.values(value).forEach(walk);
}

walk(source);
walk(manifest.assets);
for (const item of source.objects ?? []) {
  checkUrl(`/work-media/models/${item.file}.html`);
}

const mediaRoot = join(publishRoot, "work-media");
const imageRoot = join(mediaRoot, "images");
const modelRoot = join(mediaRoot, "models");
const imageCount = existsSync(imageRoot)
  ? readdirSync(imageRoot).filter((name) => statSync(join(imageRoot, name)).isFile())
      .length
  : 0;
const modelCount = existsSync(modelRoot)
  ? readdirSync(modelRoot).filter((name) => statSync(join(modelRoot, name)).isFile())
      .length
  : 0;

if (imageCount !== manifest.imageCount)
  failures.push(`expected ${manifest.imageCount} images, found ${imageCount}`);
if (modelCount !== manifest.modelCount)
  failures.push(`expected ${manifest.modelCount} models, found ${modelCount}`);
if (
  existsSync(join(publishRoot, "portfolio", "images")) ||
  existsSync(join(publishRoot, "portfolio", "models"))
)
  failures.push("legacy /portfolio media namespace is present");

if (failures.length) {
  console.error(`Work media validation failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(
  `Work media verified in ${publishRoot}: ${imageCount} images, ${modelCount} models, ${checked.size} referenced files.`,
);
