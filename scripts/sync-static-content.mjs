import { readFile, writeFile } from "node:fs/promises";

const contentUrl = new URL("../site-content.json", import.meta.url);
const outputUrl = new URL("../site-content.js", import.meta.url);
const seoConfigUrl = new URL("../seo-config.json", import.meta.url);
const seoOutputUrl = new URL("../site-seo.js", import.meta.url);
const content = JSON.parse(await readFile(contentUrl, "utf8"));
const source = `window.ALPINE_SAUBER_CONTENT = ${JSON.stringify(content)};\n`;
const seoConfig = JSON.parse(await readFile(seoConfigUrl, "utf8"));
const seoSource = `window.ALPINE_SAUBER_SEO = ${JSON.stringify(seoConfig)};\n`;

await Promise.all([
  writeFile(outputUrl, source),
  writeFile(seoOutputUrl, seoSource)
]);
