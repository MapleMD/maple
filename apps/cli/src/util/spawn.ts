// Spawn Astro from the user's site. Astro is a peer dep of the site, so we
// resolve `./node_modules/.bin/astro` from the site's cwd. This avoids
// hard-coupling to npm/pnpm/yarn - whichever installed Astro, the
// `.bin/astro` shim will be there.

import { spawn as nodeSpawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

export interface SpawnAstroOptions {
  cwd: string;
  args: string[];
}

// TODO: on Windows the shim is `.cmd`, not `.bin/astro`. Someone
// needs to test this there - I only run macOS + Linux.
function locateAstroBin(cwd: string): string {
  const candidates = [
    path.join(cwd, "node_modules", ".bin", "astro"),
    // pnpm-linked: node_modules/.pnpm layout still exposes .bin
    path.join(cwd, "node_modules", "astro", "astro.js"),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error(
    `Astro is not installed in ${cwd}. Run \`pnpm install\` (or \`npm install\`) first.`,
  );
}

export function spawnAstro({ cwd, args }: SpawnAstroOptions): Promise<void> {
  const bin = locateAstroBin(cwd);
  return new Promise((resolve, reject) => {
    const child = nodeSpawn(bin, args, { cwd, stdio: "inherit", shell: false });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve();
      else if (signal) reject(new Error(`astro terminated by signal ${signal}`));
      else reject(new Error(`astro exited with code ${code}`));
    });
  });
}
