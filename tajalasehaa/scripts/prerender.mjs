/**
 * Static prerender: renders every route to real HTML at build time so ad
 * traffic and search engines get instant, crawlable content. The client then
 * hydrates. Also writes 404.html, sitemap.xml and robots.txt.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, ".ssr");

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const { render, routeMeta, prerenderRoutes, jsonLdFor, site } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Preload the Arabic subset of the variable font (the hero headline's LCP font).
const assets = await fs.readdir(path.join(dist, "assets"));
const arabicFont = assets.find((f) => /readex-pro-arabic-wght-normal.*\.woff2$/.test(f));
const fontPreload = arabicFont ? `<link rel="preload" href="/assets/${arabicFont}" as="font" type="font/woff2" crossorigin />` : "";

function page(route, html, { noindexOverride } = {}) {
  const meta = routeMeta(route);
  const url = site.url + (route === "/" ? "/" : route);
  const noindex = noindexOverride ?? meta.noindex;
  const extra = [
    fontPreload,
    noindex ? '<meta name="robots" content="noindex" />' : "",
    ...jsonLdFor(route).map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`),
  ]
    .filter(Boolean)
    .join("\n    ");

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(meta.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(meta.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(meta.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${site.url}/og.jpg" />`)
    .replace("<!--head-extra-->", extra)
    .replace('<div id="root"><!--app--></div>', `<div id="root" data-route="${route}">${html}</div>`);
}

let count = 0;
for (const route of prerenderRoutes) {
  const out = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, page(route, render(route)));
  count++;
}
await fs.writeFile(path.join(dist, "404.html"), page("/404", render("/404"), { noindexOverride: true }));

// The demo CMS (/admin) renders in the browser only: an empty, unindexed shell.
await fs.mkdir(path.join(dist, "admin"), { recursive: true });
await fs.writeFile(
  path.join(dist, "admin", "index.html"),
  template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>لوحة التحكم | ${esc(site.name)}</title>`)
    .replace("<!--head-extra-->", '<meta name="robots" content="noindex, nofollow" />')
    .replace(/<link rel="canonical"[^>]*>/, ""),
);

const indexable = prerenderRoutes.filter((r) => !routeMeta(r).noindex);
const today = new Date().toISOString().slice(0, 10);
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((r) => `  <url><loc>${site.url}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);
await fs.writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /thank-you\nDisallow: /admin\n\nSitemap: ${site.url}/sitemap.xml\n`);

await fs.rm(ssrDir, { recursive: true, force: true });
console.log(`✓ prerendered ${count} routes + 404.html, admin shell, sitemap.xml, robots.txt`);
