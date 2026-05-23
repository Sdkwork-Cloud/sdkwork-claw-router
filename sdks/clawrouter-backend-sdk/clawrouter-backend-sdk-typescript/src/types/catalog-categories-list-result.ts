import type { CommerceProductCategoryListResponse } from './commerce-product-category-list-response';

/** Catalog categories list result schema exposed by Claw Router. */
export interface CatalogCategoriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog categories list result. */
  data?: CommerceProductCategoryListResponse;
  /** Human-readable response message. */
  msg?: string;
}
