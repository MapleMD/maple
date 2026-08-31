// `maple dev` - start the underlying Astro dev server in the current
// working directory. MapleMD is thin over Astro here - this is essentially
// `astro dev` with the option to add MapleMD-specific flags later
// (analytics, cache, etc.) without changing user muscle memory.

import { spawnAstro } from "../util/spawn.js";

export interface DevOptions {
  port?: number;
  host?: string;
}

export async function runDev(opts: DevOptions): Promise<void> {
  const args = ["dev"];
  if (opts.port) args.push("--port", String(opts.port));
  if (opts.host) args.push("--host", opts.host);
  await spawnAstro({ cwd: process.cwd(), args });
}
