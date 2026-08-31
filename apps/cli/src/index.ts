#!/usr/bin/env node
// MapleMD CLI entrypoint. Commands are thin adapters around Astro (dev,
// build, preview). Init + deploy land in a later drop.

import { Command } from "commander";
import { MAPLEMD_VERSION } from "@maplemd/core";
import { runBuild } from "./commands/build.js";
import { runDev } from "./commands/dev.js";
import { runPreview } from "./commands/preview.js";
import { createConsoleLogger } from "./util/logger.js";

const program = new Command();

program
  .name("maple")
  .description("The Git-native publishing platform for developers.")
  .version(MAPLEMD_VERSION, "-v, --version", "output the current version");

program
  .command("dev")
  .description("Start the development server.")
  .option("-p, --port <number>", "port to listen on", (v) => parseInt(v, 10))
  .option("-H, --host <host>", "host to bind to")
  .action(async (opts) => {
    await runDev(opts);
  });

program
  .command("build")
  .description("Build the static site into ./dist.")
  .action(async () => {
    await runBuild();
  });

program
  .command("preview")
  .description("Preview the built site locally.")
  .option("-p, --port <number>", "port to listen on", (v) => parseInt(v, 10))
  .option("-H, --host <host>", "host to bind to")
  .action(async (opts) => {
    await runPreview(opts);
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  const logger = createConsoleLogger({ verbose: process.argv.includes("--verbose") });
  const error = err instanceof Error ? err : new Error(String(err));
  logger.error(error.message, error);
  process.exit(1);
});
