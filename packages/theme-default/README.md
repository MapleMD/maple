# @maplemd/theme-default

The default theme for [MapleMD](../..). Minimalist typography, dark mode by default, no CSS framework.

## Install

```bash
pnpm add @maplemd/theme-default astro
```

## Usage

In an Astro page:

```astro
---
import PostLayout from "@maplemd/theme-default/layouts/PostLayout.astro";
---
<PostLayout title="Hello" date={new Date()}>
  <p>Body content.</p>
</PostLayout>
```

## Layouts

- `BaseLayout` - full document shell with header + footer.
- `PostLayout` - single post with title, date, body.
- `HomeLayout` - home page with a chronological post list.

## Styles

`@maplemd/theme-default/styles/base.css` - auto-imported by every layout. Override any CSS custom property (`--maplemd-color-*`, `--maplemd-font-*`, `--maplemd-content-width`) in your own stylesheet to reskin without ejecting.
