import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("canonical TasteLoop offers and positioning stay exact", async () => {
  const brand = await read("src/config/brand.ts");
  for (const expected of [
    "The difference is the loop.",
    "Human taste, built into every loop.",
    'name: "Taste Review"',
    'price: "$499"',
    'name: "First Loop"',
    'price: "From $3,500"',
    'name: "Product Loop"',
    'price: "$9,800 per month"',
  ]) assert.match(brand, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(brand, /siteUrl:\s*configuredSiteUrl\s*\|\|\s*"https:\/\/vibetoreal\.dev"/);
});

test("all preserved product routes still have implementations", async () => {
  for (const routeFile of [
    "src/app/shipped/page.tsx",
    "src/app/playground/page.tsx",
    "src/app/playground/flowtime/page.tsx",
    "src/app/playground/flowtime/live/page.tsx",
    "src/app/playground/cards/page.tsx",
    "src/app/playground/cards/live/page.tsx",
    "src/app/skills/page.tsx",
    "src/app/animations/page.tsx",
    "src/app/gradient/page.tsx",
  ]) assert.ok((await read(routeFile)).length > 0, `${routeFile} is missing`);
});

test("compatibility redirects and the Skills crawl contract remain intact", async () => {
  const config = await read("next.config.mjs");
  for (const source of ["/audit", "/build", "/pricing", "/pro", "/services", "/styles", "/styles/live", "/tools/vibe-audit"]) {
    assert.ok(config.includes(`source: "${source}"`), `missing redirect for ${source}`);
  }
  const robots = await read("src/app/robots.ts");
  assert.doesNotMatch(robots, /disallow:[\s\S]*"\/skills"/i);
  assert.match(await read("src/app/sitemap.ts"), /"\/skills"/);
});

test("shared Playground engine does not import a product consumer", async () => {
  const engineDir = path.join(root, "src/components/products/engine");
  const files = (await readdir(engineDir)).filter((file) => /\.[jt]sx?$/.test(file));
  for (const file of files) {
    const source = await readFile(path.join(engineDir, file), "utf8");
    assert.doesNotMatch(source, /from\s+["'][^"']*(?:flowtime|cards)\//, `${file} imports a product consumer`);
  }
});

test("user-facing source contains no old parent brand or retired offers", async () => {
  const roots = ["src/app", "src/components", "src/content"];
  const banned = /VibeToReal|Slop Rescue|Ship It Sprint|Fractional AI Product CTO|\$12\/mo/;

  async function walk(relative) {
    const entries = await readdir(path.join(root, relative), { withFileTypes: true });
    for (const entry of entries) {
      const child = path.join(relative, entry.name);
      if (entry.isDirectory()) await walk(child);
      else if (/\.(?:ts|tsx|md)$/.test(entry.name)) assert.doesNotMatch(await read(child), banned, `${child} contains retired copy`);
    }
  }

  for (const relative of roots) await walk(relative);
});

test("generated Skills mirror and articles contain no retired parent offer", async () => {
  assert.doesNotMatch(await read("../skills/README.md"), /VibeToReal|https:\/\/vibetoreal\.dev/);
  for (const article of [
    "content/blog/design-problem-vs-pmf-problem.md",
    "content/blog/your-prototype-isnt-a-product.md",
  ]) {
    assert.doesNotMatch(await read(article), /\$300 teardown|\]\(\/audit\)/i, `${article} contains the retired teardown offer`);
  }
});
