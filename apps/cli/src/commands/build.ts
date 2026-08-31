// `maple build` - production build of the current MapleMD site. Delegates
// to Astro; output lands in `dist/` per Astro defaults.

import { spawnAstro } from "../util/spawn.js";

export async function runBuild(): Promise<void> {
  await spawnAstro({ cwd: process.cwd(), args: ["build"] });
}
