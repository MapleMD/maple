// Pagination - pure. Astro has its own paginate() for getStaticPaths, but
// it doesn't fit tag pages neatly (each tag has its own set to paginate).
// This helper gives us the same shape for any list.

export interface Page<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevUrl?: string;
  nextUrl?: string;
}

export interface PaginateOptions {
  pageSize?: number;
  /** Base URL used to render prev/next links. Pass "/" for the home. */
  baseUrl?: string;
}

/** Splits items into pages of `pageSize`. Returns [] when items is empty
 *  (caller should still emit at least page 1 with no items - use
 *  `paginateAtLeastOne` for that). */
export function paginate<T>(items: readonly T[], options: PaginateOptions = {}): Page<T>[] {
  const pageSize = Math.max(1, options.pageSize ?? 10);
  const baseUrl = options.baseUrl ?? "/";
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pages: Page<T>[] = [];
  for (let i = 0; i < totalPages; i++) {
    const currentPage = i + 1;
    const start = i * pageSize;
    const slice = items.slice(start, start + pageSize);
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;
    pages.push({
      items: slice,
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      hasPrev,
      hasNext,
      prevUrl: hasPrev ? buildPageUrl(baseUrl, currentPage - 1) : undefined,
      nextUrl: hasNext ? buildPageUrl(baseUrl, currentPage + 1) : undefined,
    });
  }
  return pages;
}

function buildPageUrl(baseUrl: string, page: number): string {
  const trimmed = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return page === 1 ? trimmed : `${trimmed}${page}/`;
}
