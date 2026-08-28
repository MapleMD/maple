# @maplemd/core

Shared domain types for MapleMD. I/O-free - just interfaces.

## Install

```bash
pnpm add @maplemd/core
```

## Usage

```ts
import type { Document, Logger } from "@maplemd/core";

const doc: Document = {
  id: "posts/hello",
  slug: "hello",
  content: "# Hello",
  frontmatter: { title: "Hello" },
};

function greet(logger: Logger, name: string): void {
  logger.info(`Hello, ${name}`);
}
```
