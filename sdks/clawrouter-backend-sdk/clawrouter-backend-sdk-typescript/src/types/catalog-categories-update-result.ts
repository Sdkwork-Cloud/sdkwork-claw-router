import type { CommerceProductCategoryMutationResponse } from './commerce-product-category-mutation-response';

/** Catalog categories update result schema exposed by Claw Router. */
export interface CatalogCategoriesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog categories update result. */
  data?: CommerceProductCategoryMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
