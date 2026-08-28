// Domain types. Pure shapes, no behavior.

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
