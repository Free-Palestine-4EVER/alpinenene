import { readFile, writeFile } from "node:fs/promises";

const contentUrl = new URL("../site-content.json", import.meta.url);
const outputUrl = new URL("../site-content.js", import.meta.url);
const content = JSON.parse(await readFile(contentUrl, "utf8"));
const source = `window.ALPINE_SAUBER_CONTENT = ${JSON.stringify(content)};\n`;

await writeFile(outputUrl, source);
