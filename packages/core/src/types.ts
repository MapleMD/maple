// Domain types - pure shapes, no behavior.
//
// Intentionally minimal in M0. Full ports (ContentSource, Renderer, Plugin,
// Theme, Logger) land in M1 alongside the first working pipeline.

export interface Frontmatter {
  title: string;
  description?: string;
  date?: Date;
  tags?: string[];
  draft?: boolean;
  [key: string]: unknown;
}

export interface Document {
  id: string;
  slug: string;
  content: string;
  frontmatter: Frontmatter;
}

export interface Route {
  path: string;
  documentId: string;
}

export interface Site {
  documents: Document[];
  routes: Route[];
}
