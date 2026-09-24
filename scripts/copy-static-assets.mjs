import { copyFile, cp, mkdir } from "node:fs/promises";

const outputUrl = new URL("../dist/", import.meta.url);
await mkdir(outputUrl, { recursive: true });
await Promise.all([
  ...["script.js", "site-content.js"].map((file) =>
    copyFile(new URL(`../${file}`, import.meta.url), new URL(file, outputUrl))
  ),
  ...["cutouts", "details", "stories"].map((directory) =>
    cp(
      new URL(`../assets/${directory}/`, import.meta.url),
      new URL(`assets/${directory}/`, outputUrl),
      { recursive: true, force: true }
    )
  )
]);
