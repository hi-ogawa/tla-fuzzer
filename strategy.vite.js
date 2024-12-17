// @ts-check
// This tests the evaluation order of Vite module runner

import * as fs from "fs";
import * as path from "path";
import * as vite from "vite";

/**
 * @param {Record<string, string>} files
 * @param {string} dir
 */
export async function viteModuleRunnerStrategy(files, dir) {
  for (const name in files) {
    fs.writeFileSync(path.join(dir, name), files[name]);
  }
  const entry = path.join(
    dir,
    /** @type {string} */ (Object.keys(files).at(-1)),
  );

  return `
import * as vite from "vite";

async function main() {
  const server = await vite.createServer({ configFile: false });
  await server.ssrLoadModule(${JSON.stringify(entry)});
  await server.close();
}

await main();
`;
}

viteModuleRunnerStrategy.version = `Vite ${vite.version}`;
