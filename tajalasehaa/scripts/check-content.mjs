/**
 * Pre-publish check: lists content that still needs the center's approval.
 * Run: npm run check:content  (exits with code 1 while anything is pending)
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const site = read("src/config/site.ts");
const content = read("src/config/content.ts");
const devices = read("src/config/devices.ts");
const issues = [];

if (/isDemo:\s*true/.test(site)) issues.push("site.ts: isDemo is still true (the demo banner is visible).");
if (/moh:\s*""/.test(site)) issues.push("site.ts: MOH license number is empty (health ads in KSA must show it).");
if (/insurers:\s*\[\]/.test(site)) issues.push("site.ts: insurers list is empty (the site will show a generic insurance check).");
if (/rating:\s*null/.test(site)) issues.push("site.ts: Google rating not set (hidden).");
if (/email:\s*""/.test(site)) issues.push("site.ts: contact email is empty (hidden).");
if (/sample:\s*true/.test(content)) issues.push("content.ts: stories still contain sample quotes (section is disabled by default).");

const body = site.indexOf("export const site");
const verify = site
  .split("\n")
  .map((line, i) => ({ line, n: i + 1 }))
  .filter(({ line }, i) => line.includes("تحقق") && i >= site.slice(0, body).split("\n").length - 1);
for (const { line, n } of verify) issues.push(`site.ts:${n} needs verification → ${line.trim().replace(/^\/\*\*?|\*\/$/g, "").trim()}`);

if (issues.length) {
  console.log(`⚠️  ${issues.length} item(s) to review before publishing:\n`);
  for (const i of issues) console.log(" • " + i);
  process.exit(1);
}
console.log("✓ content looks ready to publish");
