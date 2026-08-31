// `maple preview` - serve the built `dist/` locally to sanity-check
// before deploy.

import { spawnAstro } from "../util/spawn.js";

export interface PreviewOptions {
  port?: number;
  host?: string;
}

export async function runPreview(opts: PreviewOptions): Promise<void> {
  const args = ["preview"];
  if (opts.port) args.push("--port", String(opts.port));
  if (opts.host) args.push("--host", opts.host);
  await spawnAstro({ cwd: process.cwd(), args });
}
